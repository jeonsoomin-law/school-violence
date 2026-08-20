import type { APIContext } from 'astro';
import { PREVIEW_MODE, SITE_URL } from '../consts';

/**
 * robots.txt 를 빌드 시점에 생성합니다.
 * PREVIEW_MODE 가 켜져 있으면 모든 크롤러를 차단하고, 꺼지면 정상 공개합니다.
 * (고정 파일로 두면 스위치를 바꿔도 반영되지 않아 라우트로 만들었습니다.)
 */

const blocked = `# 미리보기 모드 — 검색엔진 수집을 전면 차단합니다.
# 공개할 준비가 되면 src/consts.ts 의 PREVIEW_MODE 를 false 로 바꾸고 다시 배포하세요.
User-agent: *
Disallow: /
`;

const open = `# 모든 검색엔진 허용
User-agent: *
Allow: /
Disallow: /admin/

# 네이버 크롤러 (Yeti) — 명시적으로 허용
User-agent: Yeti
Allow: /
Disallow: /admin/

# 다음 크롤러
User-agent: Daum
Allow: /
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

export function GET(_context: APIContext) {
  if (PREVIEW_MODE) {
    console.warn(
      '\n  ⚠️  PREVIEW_MODE 가 켜져 있어 검색엔진 수집이 차단된 상태로 빌드됩니다.\n' +
        '     공개 준비가 끝나면 src/consts.ts 의 PREVIEW_MODE 를 false 로 바꾸세요.\n',
    );
  }
  return new Response(PREVIEW_MODE ? blocked : open, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
