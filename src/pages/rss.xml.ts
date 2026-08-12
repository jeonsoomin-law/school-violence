import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
  const columns = (await getCollection('column', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  return rss({
    title: `${SITE.name} 칼럼`,
    description: '학교폭력 사건 절차와 대응에 관한 변호사 칼럼',
    site: context.site!,
    items: columns.map((c) => ({
      title: c.data.title,
      description: c.data.description,
      pubDate: c.data.publishDate,
      link: `/column/${c.id}/`,
      categories: [c.data.category],
    })),
    customData: '<language>ko-kr</language>',
  });
}
