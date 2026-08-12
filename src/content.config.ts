import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** 칼럼 — 검색 유입의 핵심. 롱테일 질문형 키워드 1개당 글 1개 원칙. */
const column = defineCollection({
  loader: glob({ base: './src/content/column', pattern: '**/*.md' }),
  schema: z.object({
    /** <h1> 이자 <title>. 목표 키워드를 앞쪽에 배치 */
    title: z.string(),
    /** 메타 디스크립션. 한글 70~90자 (넘으면 검색결과에서 잘림) */
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** 목록 필터용 카테고리 */
    category: z.enum(['학폭위 절차', '가해학생 대응', '피해학생 보호', '불복·소송', '생활기록부', '기타']),
    /** 이 글이 노리는 검색어들. 메타 keywords 및 내부 관련글 매칭에 사용 */
    keywords: z.array(z.string()).default([]),
    /** 대표 이미지 (public 기준 경로, 예: /images/columns/foo.jpg) */
    cover: z.string().optional(),
    /** 목차 자동 생성 여부 */
    toc: z.boolean().default(true),
    /** 이 글 하단에 노출할 FAQ. FAQPage 구조화 데이터로도 출력됨 */
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** 해결사례 — 반드시 익명·일반화하여 작성 (변호사 광고규정 관련 README 참고) */
const caseStudy = defineCollection({
  loader: glob({ base: './src/content/case', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    /** 사건 유형 */
    category: z.enum(['학폭위', '행정심판', '행정소송', '형사·소년보호', '민사', '기타']),
    /** 의뢰인 지위 */
    side: z.enum(['가해학생으로 지목된 학생', '피해학생']),
    /** 결과 한 줄 요약. 예: "조치없음 결정" */
    outcome: z.string(),
    keywords: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** 업무분야 랜딩 페이지 — 대표 키워드를 나눠 갖는 페이지들 */
const service = defineCollection({
  loader: glob({ base: './src/content/service', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** 내비게이션·카드에 쓰는 짧은 이름 */
    shortTitle: z.string(),
    description: z.string(),
    /** 히어로 아래 들어가는 요약 문장 */
    summary: z.string(),
    /** 카드/목록 노출 순서 */
    order: z.number().default(99),
    keywords: z.array(z.string()).default([]),
    /** 핵심 포인트 3~5개 */
    points: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { column, case: caseStudy, service };
