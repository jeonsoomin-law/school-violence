/**
 * 재사용 가능한 JSON-LD 스니펫 생성기.
 * 페이지마다 필요한 것만 골라 BaseLayout 의 jsonLd 프롭으로 넘기면 됩니다.
 */
import { SITE, CONTACT, ADDRESS, ATTORNEY, absoluteUrl } from '../consts';

const ORG_ID = absoluteUrl('/#organization');

/** 사무소 자체 — 모든 페이지에 공통으로 들어갑니다. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: absoluteUrl('/'),
    description: SITE.description,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: '대한민국' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    ...(ADDRESS.lat && ADDRESS.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: ADDRESS.lat, longitude: ADDRESS.lng } }
      : {}),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    knowsAbout: [
      '학교폭력',
      '학교폭력대책심의위원회',
      '학교폭력예방법',
      '행정심판',
      '행정소송',
      '소년보호사건',
    ],
    employee: {
      '@type': 'Attorney',
      name: ATTORNEY.name,
      jobTitle: ATTORNEY.jobTitle,
      description: ATTORNEY.bio,
      ...(ATTORNEY.photo ? { image: absoluteUrl(ATTORNEY.photo) } : {}),
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: SITE.name,
    inLanguage: 'ko-KR',
    publisher: { '@id': ORG_ID },
  };
}

export type Crumb = { name: string; href: string };

/** 검색결과에 경로가 표시되게 하는 빵부스러기 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

/** 칼럼·해결사례 본문용 */
export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title.slice(0, 110),
    description: opts.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(opts.url) },
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    inLanguage: 'ko-KR',
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(', ') } : {}),
    author: {
      '@type': 'Person',
      name: ATTORNEY.name,
      jobTitle: ATTORNEY.jobTitle,
      worksFor: { '@id': ORG_ID },
    },
    publisher: { '@id': ORG_ID },
  };
}

/** FAQ 리치 스니펫 — 검색결과에서 차지하는 면적이 커서 클릭률이 올라갑니다. */
export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** 업무분야 랜딩용 */
export function serviceSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: '대한민국' },
  };
}
