import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../consts';

/**
 * 칼럼 + 해결사례 RSS.
 * 네이버 서치어드바이저 → 요청 → RSS 제출 에 이 주소(/rss.xml)를 등록하면
 * 네이버가 새 글을 사이트맵보다 빨리 알아챕니다. (https://searchadvisor.naver.com/guide/request-feed)
 * 예전에는 칼럼만 들어 있어서 해결사례 새 글은 RSS 로 알려지지 않았습니다.
 */
export async function GET(context: APIContext) {
  const columns = await getCollection('column', ({ data }) => !data.draft);
  const cases = await getCollection('case', ({ data }) => !data.draft);

  const items = [
    ...columns.map((c) => ({
      title: c.data.title,
      description: c.data.description,
      pubDate: c.data.publishDate,
      link: `/column/${c.id}/`,
      categories: ['칼럼', c.data.category],
    })),
    ...cases.map((c) => ({
      title: c.data.title,
      description: c.data.description,
      pubDate: c.data.publishDate,
      link: `/case/${c.id}/`,
      categories: ['해결사례', c.data.category],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: `${SITE.name} 칼럼·해결사례`,
    description: '학교폭력·교원 사건 절차와 대응에 관한 변호사 칼럼과 해결사례',
    site: context.site!,
    items,
    customData: '<language>ko-kr</language>',
  });
}
