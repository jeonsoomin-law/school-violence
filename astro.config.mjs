// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL 은 src/consts.ts 와 동일하게 유지하세요.
const SITE_URL = 'https://example.com'; // TODO: 실제 도메인

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
      lastmod: new Date(),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
