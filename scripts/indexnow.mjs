/**
 * IndexNow — 새 글·수정된 글·지운 글의 주소를 검색엔진에 바로 알립니다.
 * GitHub Actions 배포 워크플로(.github/workflows/deploy.yml)가 자동으로 실행합니다.
 *
 * 왜 필요한가:
 *   사이트맵은 검색로봇이 "가끔 와서 읽어 가는" 목록이라, 새 글이 생겨도 로봇이 다시 올 때까지 모릅니다.
 *   IndexNow 는 우리가 먼저 "이 주소가 바뀌었다" 고 알리는 방식입니다.
 *   네이버(2023년 7월부터 지원)·Bing 등이 받습니다. 구글은 IndexNow 를 쓰지 않습니다(사이트맵으로 갑니다).
 *
 * 어떤 주소를 알리나:
 *   배포 직전의 실제 사이트 사이트맵과, 이번에 새로 빌드한 사이트맵(dist/)을 비교해서
 *     - 새로 생긴 주소
 *     - lastmod(수정일)가 바뀐 주소 → 관리자 화면에서 저장하면 바뀝니다 (scripts/content-lastmod.mjs)
 *     - 사라진 주소 (검색엔진이 404 를 확인하고 검색결과에서 내리도록)
 *   만 보냅니다. 배포가 중간에 취소돼도 다음 배포가 "실제 사이트" 와 비교하므로 빠지는 글이 없습니다.
 *
 * 사용법 (워크플로가 순서대로 실행):
 *   node scripts/indexnow.mjs snapshot <저장할파일.json>   ← 배포 "전" 실제 사이트 사이트맵 저장
 *   node scripts/indexnow.mjs submit <저장한파일.json>      ← 배포 "후" 비교해서 전송
 *   node scripts/indexnow.mjs submit <파일.json> --dry-run  ← 보낼 목록만 출력 (로컬 확인용)
 *
 * 알림이 실패해도 배포 자체는 실패로 처리하지 않습니다. 결과는 Actions 실행 화면의 알림(annotation)에 남습니다.
 *
 * 키(KEY):
 *   public/<KEY>.txt 파일이 사이트에 올라가 있어야 검색엔진이 "이 사이트 주인이 보낸 알림" 으로 인정합니다.
 *   키는 공개돼도 괜찮은 값입니다. 바꾸려면 아래 KEY 와 public/ 의 파일 이름·내용을 함께 바꾸세요.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

// src/consts.ts 의 SITE_URL 과 같게 유지하세요.
const SITE_URL = 'https://xn--9d0bl9rcud00eco4am3bz1b.net'; // 학교폭력변호사.net
const KEY = 'c2816d669a06bc83a487ffe12785fa2c';
const DIST = 'dist';

/** 네이버로 직접 보내고, api.indexnow.org 로도 보내 Bing 등 다른 참여 검색엔진에도 전달되게 합니다. */
const ENDPOINTS = ['https://searchadvisor.naver.com/indexnow', 'https://api.indexnow.org/indexnow'];

const notice = (msg) => console.log(`::notice title=IndexNow::${msg}`);
const warning = (msg) => console.log(`::warning title=IndexNow::${msg}`);

/** 사이트맵 XML → Map<주소, lastmod(없으면 '')> */
function parseUrlset(xml, into = new Map()) {
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ?? '';
    into.set(loc, lastmod);
  }
  return into;
}

const sameTime = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return new Date(a).getTime() === new Date(b).getTime();
};

async function snapshot(outFile) {
  const urls = new Map();
  try {
    const res = await fetch(`${SITE_URL}/sitemap-index.xml`);
    if (!res.ok) throw new Error(`sitemap-index.xml ${res.status}`);
    const index = await res.text();
    const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    for (const sm of sitemaps) {
      const r = await fetch(sm);
      if (!r.ok) throw new Error(`${sm} ${r.status}`);
      parseUrlset(await r.text(), urls);
    }
    writeFileSync(outFile, JSON.stringify({ ok: true, urls: Object.fromEntries(urls) }, null, 2));
    console.log(`배포 전 사이트맵 저장: 주소 ${urls.size}개 → ${outFile}`);
  } catch (e) {
    // 비교 기준이 없으면 무엇이 바뀌었는지 알 수 없으므로 이번 배포는 알림을 건너뜁니다.
    writeFileSync(outFile, JSON.stringify({ ok: false, error: String(e) }));
    warning(`배포 전 사이트맵을 읽지 못해 이번 배포는 알림을 건너뜁니다: ${e}`);
  }
}

async function submit(prevFile, dryRun) {
  if (!existsSync(prevFile)) return warning(`${prevFile} 이 없어 알림을 건너뜁니다.`);
  const prev = JSON.parse(readFileSync(prevFile, 'utf8'));
  if (!prev.ok) return warning('배포 전 사이트맵이 없어 알림을 건너뜁니다.');

  // 미리보기 모드(robots.txt 전체 차단)일 때는 알리지 않습니다.
  const robots = readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
  if (/^Disallow:\s*\/\s*$/m.test(robots)) return notice('미리보기 모드라 알림을 보내지 않습니다.');

  const keyFile = path.join(DIST, `${KEY}.txt`);
  if (!existsSync(keyFile) || readFileSync(keyFile, 'utf8').trim() !== KEY) {
    return warning(`키 파일 public/${KEY}.txt 가 없거나 내용이 달라 알림을 보낼 수 없습니다.`);
  }

  const next = new Map();
  for (const f of readdirSync(DIST)) {
    if (/^sitemap-\d+\.xml$/.test(f)) parseUrlset(readFileSync(path.join(DIST, f), 'utf8'), next);
  }
  const before = new Map(Object.entries(prev.urls));

  const added = [...next.keys()].filter((u) => !before.has(u));
  const changed = [...next.keys()].filter((u) => before.has(u) && !sameTime(before.get(u), next.get(u)));
  const removed = [...before.keys()].filter((u) => !next.has(u));
  const urlList = [...added, ...changed, ...removed].slice(0, 10000); // 프로토콜 한도 10,000개

  const decode = (u) => decodeURI(new URL(u).pathname);
  console.log(`새 주소 ${added.length}개, 수정 ${changed.length}개, 삭제 ${removed.length}개`);
  for (const [label, list] of [['새 글', added], ['수정', changed], ['삭제', removed]]) {
    for (const u of list) console.log(`  [${label}] ${decode(u)}`);
  }

  if (urlList.length === 0) return notice('바뀐 주소가 없어 보낼 알림이 없습니다.');
  if (dryRun) return console.log('--dry-run: 실제로 보내지 않았습니다.');

  const body = JSON.stringify({
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  });

  const results = [];
  for (const endpoint of ENDPOINTS) {
    const name = new URL(endpoint).host;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      });
      // 200 = 접수, 202 = 접수(키 확인 중). 그 밖에는 실패.
      const text = res.ok ? '' : ` ${(await res.text()).slice(0, 200)}`;
      results.push(`${name} ${res.status}${text}`);
      if (!res.ok) warning(`${name} 응답 ${res.status}${text}`);
    } catch (e) {
      results.push(`${name} 오류`);
      warning(`${name} 전송 실패: ${e}`);
    }
  }
  notice(
    `주소 ${urlList.length}개 전송 (새 ${added.length} · 수정 ${changed.length} · 삭제 ${removed.length}) → ${results.join(', ')}`,
  );
}

const [mode, file, flag] = process.argv.slice(2);
try {
  if (mode === 'snapshot' && file) await snapshot(file);
  else if (mode === 'submit' && file) await submit(file, flag === '--dry-run');
  else console.log('사용법: node scripts/indexnow.mjs snapshot|submit <파일.json> [--dry-run]');
} catch (e) {
  // 어떤 경우에도 배포를 실패로 만들지 않습니다.
  warning(`예상치 못한 오류: ${e}`);
}
