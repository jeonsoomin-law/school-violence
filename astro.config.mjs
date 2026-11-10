// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { contentLastmod } from './scripts/content-lastmod.mjs';

// SITE_URL 은 src/consts.ts 와 동일하게 유지하세요. 두 파일을 함께 바꿔야 합니다.
// 한글 도메인 `학교폭력변호사.net` 의 퓨니코드 표기입니다.
const SITE_URL = 'https://xn--9d0bl9rcud00eco4am3bz1b.net'; // 학교폭력변호사.net

// 페이지별 실제 수정일. 자세한 이유는 scripts/content-lastmod.mjs 상단 설명 참고.
const lastmodByPath = contentLastmod();

export default defineConfig({
  site: SITE_URL,
  // 모든 URL 끝에 슬래시를 강제 → /column/foo 와 /column/foo/ 중복 색인 방지
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // 색인 대상이 아닌 경로 제외.
      // 주의: 단순 includes('/admin') 로 걸면 /column/administrative-... 같은 글까지
      // 함께 빠지므로 경로 앞부분을 정확히 비교합니다.
      filter: (page) => {
        const { pathname } = new URL(page);
        return !pathname.startsWith('/admin/') && pathname !== '/privacy/';
      },
      changefreq: 'weekly',
      // 예전처럼 lastmod: new Date() 로 두면 모든 페이지가 배포 시각으로 똑같이 찍혀
      // 검색엔진이 새 글을 구분하지 못합니다. 페이지마다 실제 수정일을 넣고, 모르면 비웁니다.
      serialize(item) {
        const lastmod = lastmodByPath.get(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod;
        else delete item.lastmod;
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
