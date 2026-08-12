# 학교폭력 전담 변호사 홈페이지

Astro 기반 정적 사이트. **모든 페이지가 빌드 시점에 완전한 HTML로 생성**되므로 구글은 물론
자바스크립트 실행에 약한 네이버 크롤러(Yeti)도 본문을 그대로 읽습니다.

- 글쓰기: Markdown 파일 또는 웹 관리자 화면(`/admin/`)
- 배포: Cloudflare Pages / Vercel / Netlify (무료 플랜으로 충분)
- 런타임 자바스크립트: **0KB** (메뉴·FAQ 아코디언까지 CSS/HTML만으로 동작)

---

## 1. 실행

```bash
npm install
```

```bash
npm run dev
```

`http://localhost:4321` 에서 확인합니다.

```bash
npm run build
```

`dist/` 에 정적 파일이 생성됩니다.

---

## 2. 가장 먼저 바꿔야 할 것 (TODO)

코드 전체에 `TODO` 로 표시해 두었습니다. 아래 순서로 처리하시면 됩니다.

| 파일 | 바꿀 내용 |
| --- | --- |
| `src/consts.ts` | 상호, 전화번호, 주소, 이메일, 카카오톡 채널, 대표 변호사 정보 |
| `src/consts.ts` | `SITE_URL` — 실제 도메인 |
| `astro.config.mjs` | `SITE_URL` — 위와 동일하게 |
| `public/robots.txt` | 맨 아래 `Sitemap:` 도메인 |
| `public/admin/config.yml` | `backend.repo`, `base_url` |
| `src/pages/about.astro` | 약력·취급분야 (`career`, `focus` 배열) |
| `src/pages/privacy.astro` | 개인정보처리방침 전체 검토 |
| `scripts/generate-og.mjs` | 상호 변경 후 `node scripts/generate-og.mjs` 재실행 |

---

## 3. 구조

```
src/
├─ consts.ts              사이트 전역 설정 — 여기 하나만 고치면 전체 반영
├─ content.config.ts      글의 필드 정의(스키마)
├─ content/
│  ├─ column/*.md         칼럼
│  ├─ case/*.md           해결사례
│  └─ service/*.md        업무분야 랜딩 페이지
├─ lib/schema.ts          구조화 데이터(JSON-LD) 생성기
├─ layouts/BaseLayout.astro   모든 페이지의 <head> · SEO 태그
├─ components/
└─ pages/
   ├─ index.astro                 홈
   ├─ school-violence/index.astro 필러 페이지 (절차 총정리)
   ├─ service/                    업무분야
   ├─ column/                     칼럼
   ├─ case/                       해결사례
   ├─ about / contact / privacy / 404
   └─ rss.xml.ts
public/
├─ admin/                 관리자 화면(CMS)
├─ robots.txt
└─ og-default.png         공유 썸네일
```

### URL 설계

```
/                                       학교폭력 변호사 (대표)
/school-violence/                       학교폭력 절차 총정리 (필러)
/service/school-violence-committee/     학폭위 대응
/service/accused/                       가해학생 지목 대응
/service/victim/                        피해학생 보호
/service/appeal/                        조치 불복 (행정심판·소송)
/service/cyber/                         사이버폭력·SNS
/service/criminal/                      형사·소년보호
/column/<영문-슬러그>/                   칼럼
/case/<영문-슬러그>/                     해결사례
```

홈 하나로 모든 키워드를 먹을 수 없기 때문에 **주제별로 페이지를 나눠 놓은 구조**입니다.
자세한 운영 방법은 [`docs/seo-guide.md`](docs/seo-guide.md) 를 보세요.

---

## 4. 글쓰기

### 방법 A — Markdown 파일 직접 추가

`src/content/column/` 에 `.md` 파일을 하나 만들면 목록·사이트맵·RSS·구조화 데이터에 자동 반영됩니다.
파일명이 그대로 URL이 되므로 **영문 소문자와 하이픈**으로 지으세요.

```markdown
---
title: 학폭위 서면 의견서, 무엇을 어떻게 쓸까
description: 심의위원회에 제출하는 의견서의 구성과 실제로 설득력이 생기는 서술 방식을 정리했습니다.
publishDate: 2026-09-01
category: 학폭위 절차
keywords: [학폭위 의견서, 학교폭력 의견서 양식]
faq:
  - q: 의견서는 몇 장 정도가 적당한가요?
    a: 분량보다 구조가 중요합니다. 쟁점별로 소제목을 나눠 3~5장 내외로 정리하는 경우가 많습니다.
---

## 첫 소제목

본문...
```

### 방법 B — 웹 관리자 화면 (변호사님이 직접 작성)

`/admin/` 에서 로그인하면 글쓰기 화면이 열립니다. 저장하면 GitHub에 커밋되고 사이트가 자동으로
다시 배포됩니다. 설정 방법은 아래 6번을 보세요.

### 로컬에서 관리자 화면 미리 써보기

배포·로그인 설정 전에도 지금 바로 써볼 수 있습니다. 별도 서버가 필요 없습니다.

```bash
npm run dev
```

**크롬 또는 엣지**로 `http://localhost:4321/admin/index.html` 접속 → **로컬 저장소로 작업** 클릭 →
프로젝트 폴더(`school-violence-center`) 선택 → 접근 허용.

> 개발 중에는 주소 끝에 `index.html` 까지 붙여야 합니다. 배포한 뒤에는 `내도메인.com/admin/` 으로 됩니다.

이 모드에서는 글이 내 컴퓨터의 `src/content/` 폴더에 바로 저장됩니다. GitHub에 올리는 것은
직접 커밋·푸시해야 합니다(배포 후 GitHub 로그인 모드에서는 자동으로 커밋됩니다).

> 이 로컬 모드는 브라우저의 파일 접근 기능을 쓰기 때문에 **크로미움 계열(크롬·엣지·브레이브)에서만**
> 동작합니다. 사파리·파이어폭스에서는 안 됩니다. 배포 후 GitHub 로그인 방식은 모든 브라우저에서 됩니다.

---

## 5. 배포

빌드 결과(`dist/`)는 그냥 HTML 파일 묶음이라 어느 정적 호스팅이든 올라갑니다.
아래 셋 중 하나를 고르시면 됩니다.

> 어디에 올리든, `SITE_URL` 을 실제 도메인으로 바꾸지 않으면 canonical·사이트맵·OG 태그가
> 전부 `example.com` 을 가리킵니다. 배포 전에 꼭 확인하세요.

### A. Cloudflare Pages — 가장 손이 덜 갑니다

1. GitHub에 저장소를 만들고 이 폴더를 푸시합니다
2. Cloudflare Pages → **Create a project** → 저장소 연결
3. 빌드 설정
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Custom domains** 에서 도메인 연결

전송량 무제한이고, 깃에 푸시하면 알아서 다시 배포됩니다. Vercel·Netlify도 동일합니다.

### B. Firebase Hosting

무료 한도는 **저장 10GB, 하루 전송 360MB**, 커스텀 도메인과 SSL 무료입니다.
이 사이트는 한 페이지에 30~60KB 정도만 쓰므로 **하루 6,000~7,000 페이지뷰**까지 여유가 있습니다.

`firebase.json` 은 이미 만들어 두었습니다. 설정 의미는 다음과 같습니다.

| 설정 | 왜 이렇게 두었나 |
| --- | --- |
| `"public": "dist"` | Astro 가 만든 폴더를 그대로 서비스합니다. `dist/404.html` 은 Firebase 가 자동으로 404 페이지로 인식합니다 |
| `"cleanUrls": false` | `true` 면 Firebase 가 주소 끝 슬래시를 떼어냅니다. 이 사이트는 `/column/글주소/` 형태를 정답(canonical)으로 쓰므로 서로 충돌합니다 |
| `"trailingSlash": true` | 슬래시 없는 주소로 들어와도 붙여서 한 곳으로 모읍니다. 같은 페이지가 두 주소로 색인되는 것을 막습니다 |
| `headers` | 파일명에 해시가 붙는 자산은 1년 캐시, HTML 은 매번 새로 확인. 글을 고치면 바로 반영되면서도 재방문이 빠릅니다 |

> JSON 파일에는 주석을 쓸 수 없어 설명을 여기에 두었습니다.

```bash
npm install -g firebase-tools
```

```bash
firebase login
```

```bash
firebase init hosting
```

`firebase init hosting` 에서 물어보는 것들:

| 질문 | 답 |
| --- | --- |
| Use an existing project / Create a new project | 프로젝트 선택 또는 새로 만들기 |
| What do you want to use as your public directory? | **`dist`** (이미 `firebase.json` 에 있어 그대로 두면 됩니다) |
| Configure as a single-page app? | **No** ← 중요. Yes 하면 모든 주소가 홈으로 가버립니다 |
| Set up automatic builds and deploys with GitHub? | **Yes** ← 아래 설명 참고 |
| File dist/404.html already exists. Overwrite? | **No** |
| File dist/index.html already exists. Overwrite? | **No** |

배포:

```bash
npm run build
```

```bash
firebase deploy --only hosting
```

**GitHub 자동 배포를 꼭 켜세요.** Firebase는 기본적으로 위 명령을 직접 쳐야 배포됩니다.
그런데 관리자 화면(`/admin/`)에서 쓴 글은 GitHub에 저장되므로, 자동 배포를 켜두지 않으면
**글을 써도 사이트에 안 올라갑니다.** `firebase init hosting` 에서 GitHub 연동을 Yes 로 하면
`.github/workflows/` 에 자동 배포 설정이 만들어집니다. 이미 건너뛰었다면 다시 실행하세요.

```bash
firebase init hosting:github
```

도메인 연결은 Firebase 콘솔 → Hosting → **맞춤 도메인 추가**.

### C. 그 외

GitHub Pages, AWS S3+CloudFront 등 정적 파일을 올릴 수 있는 곳이면 어디든 됩니다.
`dist/` 폴더를 통째로 올리면 끝입니다.

---

## 6. 관리자 화면(CMS) 로그인 설정

로그인 방법이 세 가지 있습니다. 상황에 맞는 것을 고르세요.

| 방법 | 준비물 | 언제 |
| --- | --- | --- |
| **로컬 저장소로 작업** | 없음 | 내 컴퓨터에서 작업할 때. 배포 전 연습 |
| **액세스 토큰으로 로그인** | GitHub 계정 + 토큰 1회 발급 | 배포 후 혼자 글 쓸 때. 가장 빠른 시작 |
| **GitHub(으)로 로그인** | 아래 OAuth 설정 | 변호사님이 계속 쓰실 때. 버튼 한 번이면 로그인 |

### 액세스 토큰으로 로그인 (중계 서버 없이 바로)

1. `내도메인.com/admin/` → **액세스 토큰으로 로그인** 클릭
2. 뜨는 창의 링크를 누르면 GitHub 토큰 발급 페이지가 **필요한 권한이 미리 선택된 채로** 열립니다
3. 토큰을 만들고 복사해서 창에 붙여넣기
4. 토큰은 브라우저에 저장되어 다음부터는 바로 들어갑니다

혼자 쓰실 때는 이걸로 충분합니다. 다만 토큰을 발급받는 과정이 비개발자에게는 낯설 수 있어,
변호사님이 직접 계속 쓰실 거면 아래 OAuth 설정을 해두는 편이 낫습니다.

### GitHub 로그인 (OAuth) 설정

버튼 한 번으로 로그인되게 만드는 방식입니다. 인증을 중계할 작은 서버가 하나 필요한데,
Cloudflare Workers로 무료로 띄울 수 있고 한 번만 설정하면 됩니다.

1. **GitHub OAuth App 생성**
   `GitHub → Settings → Developer settings → OAuth Apps → New OAuth App`
   - Homepage URL: `https://내도메인.com`
   - Authorization callback URL: 아래 3번에서 만든 Worker 주소 + `/callback`
   - 생성 후 **Client ID** 와 **Client Secret** 을 받아둡니다

2. **인증 Worker 배포**
   [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) 저장소의
   "Deploy to Cloudflare" 버튼으로 배포하고, 환경변수에 위 Client ID / Secret 을 넣습니다.

3. **`public/admin/config.yml` 수정** — `base_url` 줄의 주석(`#`)을 풀고 Worker 주소를 넣습니다

   ```yaml
   backend:
     name: github
     repo: 깃허브아이디/저장소이름
     branch: main
     base_url: https://내워커주소.workers.dev
   ```

4. `https://내도메인.com/admin/` 접속 → GitHub 로그인 → 글쓰기

> `base_url` 을 설정하지 않은 채 "GitHub(으)로 로그인" 을 누르면 실패합니다.
> 설정 전에는 **로컬 저장소** 또는 **액세스 토큰** 방식을 쓰세요.

> 관리자 화면은 `robots.txt` 와 `noindex` 로 검색 노출에서 제외해 두었습니다.

---

## 7. 검색엔진 등록 (배포 직후 반드시)

만들어만 두면 노출되지 않습니다. 아래 등록이 실제 유입의 시작점입니다.

### 구글

1. [Google Search Console](https://search.google.com/search-console) 에서 도메인 등록
2. HTML 태그 방식으로 확인 → 발급된 코드를 `src/consts.ts` 의 `VERIFICATION.google` 에 입력 후 재배포
3. **Sitemaps** 메뉴에 `sitemap-index.xml` 제출

### 네이버

1. [네이버 서치어드바이저](https://searchadvisor.naver.com) → 사이트 등록
2. HTML 태그 확인 → 코드를 `VERIFICATION.naver` 에 입력 후 재배포
3. **요청 → 사이트맵 제출** 에 `sitemap-index.xml` 제출
4. **요청 → 웹페이지 수집** 으로 주요 페이지를 개별 수집 요청

### 다음

[다음 검색등록](https://register.search.daum.net) 에서 사이트 등록

### 네이버 스마트플레이스

지역 검색("○○동 학교폭력 변호사")에 잡히려면 별도로 등록해야 합니다.
[네이버 스마트플레이스](https://smartplace.naver.com) → 업체 등록.

---

## 8. 콘텐츠 관련 유의사항

### 법률정보의 정확성

`src/content/` 의 글과 `src/pages/school-violence/index.astro` 의 절차 설명은 **초안**입니다.
학교폭력 관련 법령·지침은 개정이 잦고(특히 생활기록부 기재·보존 기간, 대입 반영 범위),
세부 기준이 학년도별로 달라집니다. **게시 전에 현행 규정 기준으로 검토해 주세요.**

### 변호사 광고 규정

해결사례 페이지는 대한변호사협회 「변호사 광고에 관한 규정」의 적용을 받습니다.
사건 결과를 알리는 것 자체가 금지되지는 않으나 아래를 유의해야 합니다.

- 승소율·성공률·처리건수 등 수치 표현은 문제될 소지가 큽니다
- 학교명·지역·시기 조합으로 의뢰인이 특정될 수 있으면 비밀유지의무 위반이 됩니다
- 결과를 보장하거나 오인하게 하는 표현은 피해야 합니다

그래서 이 사이트는 이렇게 설계했습니다.

- 해결사례를 **결과가 아니라 "어떤 쟁점을 어떻게 다투었는지" 과정 중심**으로 서술
- 모든 사례 페이지 하단에 각색·일반화 및 결과 비보장 고지를 **자동 삽입**
- 목록 페이지 상단에도 동일 취지의 안내 배치

최종 문구는 규정을 확인하신 뒤 확정해 주세요.

---

## 9. 자주 하는 작업

**업무분야 페이지 추가** — `src/content/service/` 에 `.md` 추가. `order` 로 순서 조정.

**메뉴 수정** — `src/consts.ts` 의 `NAV` 배열.

**색상 변경** — `src/styles/global.css` 상단 `:root` 변수.

**공유 썸네일 재생성** — `scripts/generate-og.mjs` 의 문구 수정 후

```bash
node scripts/generate-og.mjs
```

**글 임시저장** — frontmatter에 `draft: true` 를 넣으면 빌드에서 제외됩니다.
