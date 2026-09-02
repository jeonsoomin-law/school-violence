/**
 * 사이트 전역 설정.
 * ─────────────────────────────────────────────
 * 사무소·변호사 정보는 school-violence.kr 공개 정보를 기준으로 채웠습니다.
 * 아직 확인이 필요한 값에만 TODO 를 남겨두었습니다.
 * 이 파일 하나만 고치면 사이트 전체(메타태그·구조화데이터·푸터·상담버튼)에 반영됩니다.
 */

/**
 * ⚠️ 미리보기 모드 스위치
 * ─────────────────────────────────────────────
 * true  = 검색엔진 차단. 모든 페이지에 noindex, robots.txt 로 전체 수집 거부.
 * false = 검색엔진 공개.
 *
 * 아래 두 가지가 끝나면 false 로 바꾸고 다시 배포하세요.
 *   1. 칼럼·해결사례 법률 내용 검토 (현재 예시 성격의 글이 섞여 있습니다)
 *   2. 도메인 연결 후 SITE_URL 변경
 */
export const PREVIEW_MODE = false;

/**
 * 배포 도메인. 사이트맵/canonical/OG 태그의 기준이 됩니다. 끝에 슬래시 없이.
 * 한글 도메인 `학교폭력변호사.net` 의 퓨니코드 표기입니다.
 * (한글 그대로 적어도 브라우저가 같은 값으로 변환하지만, 파일 인코딩 문제를 피하려고 퓨니코드로 둡니다)
 *
 * ⚠️ 이 값을 바꾸면 astro.config.mjs 의 SITE_URL 도 반드시 함께 바꾸세요.
 */
export const SITE_URL = 'https://xn--9d0bl9rcud00eco4am3bz1b.net'; // 학교폭력변호사.net

export const SITE = {
  /** 브랜드명 (헤더·푸터·JSON-LD). 주요 타깃 키워드를 앞에 둡니다. */
  name: '학교폭력변호사 전수민',
  /** 법인 정식 명칭 */
  legalName: '법무법인 정향',
  /** 홈 <title> 에 붙는 한 줄 설명 */
  tagline: '학교폭력변호사',
  /** 홈 메타 디스크립션 (한글 기준 70~90자 권장 — 넘으면 검색결과에서 잘립니다) */
  description:
    '학교폭력변호사 전수민. 교사·서울시교육청 전담 변호사 출신이 학폭위 대응부터 조치 불복 행정심판·행정소송, 피해학생 보호조치까지 전 과정을 맡습니다. 초기 대응이 결과를 바꿉니다.',
  locale: 'ko_KR',
  lang: 'ko',
} as const;

export const CONTACT = {
  /** 표시용 전화번호 */
  phone: '010-8304-9490',
  /** tel: 링크용 (숫자만) */
  phoneHref: '+821083049490',
  /** 카카오톡 채널 상담 링크. 없으면 빈 문자열 '' 로 두면 버튼이 숨겨집니다. */
  kakao: '', // TODO: 카카오톡 채널이 있으면 주소 입력
  email: 'soomin.jeon0@gmail.com',
  /** 상담 가능 시간 (JSON-LD openingHours 에도 사용) */
  hours: '평일 09:00 – 18:00',
} as const;

export const ADDRESS = {
  street: '서초구 서초대로78길 5 대각빌딩 17층',
  city: '서울특별시',
  region: '서울',
  postalCode: '06620',
  country: 'KR',
  /** 지도 표시용 좌표 (대각빌딩 대략 위치) */
  lat: 37.4934,
  lng: 127.0272,
} as const;

/** 대표 변호사 정보 — Attorney 구조화 데이터에 사용 */
export const ATTORNEY = {
  name: '전수민',
  jobTitle: '학교폭력 전문 변호사',
  /** 약력 한 줄 */
  bio: '고등학교 교사와 서울시교육청 상근 변호사를 거친 학교폭력변호사. 학폭위 대응과 조치 불복을 중심으로 소년사건, 교원징계, 아동학대, 교육활동침해 사건을 전담합니다.',
  /** 프로필 사진 경로 (public 기준). 없으면 '' */
  photo: '/images/attorney-portrait.webp',
  /** 첫 화면에 쓰는 컷 */
  heroPhoto: '/images/attorney-hero.webp',
} as const;

/**
 * 첫 화면 자격 스트립에 노출되는 항목.
 * ─────────────────────────────────────────────
 * 위촉장 원본과 school-violence.kr 공개 약력을 대조해 확정한 목록입니다.
 * 현재 위촉 중인 것과 과거 이력을 구분해야 하면 label 에 "前" 을 붙이세요.
 * 항목을 지우려면 그냥 줄을 삭제하면 됩니다.
 */
export const CREDENTIALS = [
  { label: '교육부', detail: '학교폭력사안처리 가이드북 집필위원' },
  { label: '서울시교육청', detail: '학교폭력 전담 변호사' },
  { label: '학교', detail: '고등학교 교사 경력' },
  { label: '자문', detail: '100개 이상의 학교, 교육부, 교육청, 한국교총 등 자문 변호사' },
  { label: '연수', detail: '대한변협, 교육청, 학교전담경찰관, 장학사, 학폭심의위원 등 연수 강사' },
] as const;

/**
 * 자격 스트립 아래 기관 로고. 위촉·자문·연수 이력이 있는 기관만 넣습니다.
 * 파일은 public/images/logos/ 에 있고, 출처는 각 기관 공식 CI 또는 위키미디어 공용(정부저작물)입니다.
 * 항목을 빼려면 줄을 지우면 됩니다. w/h 는 원본 비율 유지용이고,
 * scale 은 세로로 긴 로고가 작게 보일 때 살짝 키우는 배율입니다(생략하면 1).
 */
export const CREDENTIAL_LOGOS = [
  { name: '교육부', src: '/images/logos/moe.svg', w: 2048, h: 828, scale: 1.1 },
  { name: '서울특별시교육청', src: '/images/logos/sen.svg', w: 2048, h: 458 },
  { name: '대한변호사협회', src: '/images/logos/kba.png', w: 213, h: 43, scale: 1.15 },
  { name: '한국교원단체총연합회', src: '/images/logos/kfta.svg', w: 353, h: 56 },
] as const;

/**
 * 상담신청 폼이 데이터를 보낼 주소.
 * 정적 사이트라 서버가 없으므로 외부 폼 서비스를 씁니다.
 *  - Web3Forms(무료): https://web3forms.com  → access_key 발급 후 아래 endpoint 유지 + accessKey 입력
 *  - Formspree      : https://formspree.io   → endpoint 를 form 주소로 교체하고 accessKey 는 '' 로
 * 값이 비어 있으면 폼은 "전화/카카오톡으로 문의" 안내만 표시합니다.
 */
export const FORM = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: 'bc461f94-ea87-4585-b432-d4395ac987e0',
} as const;

/** 검색엔진 웹마스터도구 소유확인 메타태그 값 (등록 후 발급받은 코드만 입력) */
export const VERIFICATION = {
  google: '', // TODO: Google Search Console
  naver: '', // TODO: 네이버 서치어드바이저
} as const;

/** 상단 내비게이션 */
export const NAV = [
  { label: '학교폭력 절차', href: '/school-violence/' },
  { label: '업무분야', href: '/service/' },
  { label: '해결사례', href: '/case/' },
  { label: '의뢰인 후기', href: '/review/' },
  { label: '칼럼', href: '/column/' },
  { label: '변호사 소개', href: '/about/' },
  { label: '상담신청', href: '/contact/' },
] as const;

/** 절대 URL 생성 헬퍼 */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL + '/').href;
}
