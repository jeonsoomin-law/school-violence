/**
 * 사이트 전역 설정.
 * ─────────────────────────────────────────────
 * ⚠️ 실제 정보로 교체가 필요한 값은 모두 TODO 로 표시했습니다.
 * 이 파일 하나만 고치면 사이트 전체(메타태그·구조화데이터·푸터·상담버튼)에 반영됩니다.
 */

/**
 * 배포 도메인. 사이트맵/canonical/OG 태그의 기준이 됩니다. 끝에 슬래시 없이.
 * 지금은 Firebase 기본 주소. 도메인을 구입하면 이 값과 astro.config.mjs 를 함께 바꾸세요.
 */
export const SITE_URL = 'https://school-violence-b29b3.web.app';

export const SITE = {
  /** 브랜드명 (헤더·푸터·JSON-LD) */
  name: '학교폭력 법률센터', // TODO
  /** 법인 정식 명칭 */
  legalName: '법무법인 OOO', // TODO
  /** 홈 <title> 에 붙는 한 줄 설명 */
  tagline: '학교폭력 전담 변호사',
  /** 홈 메타 디스크립션 (한글 기준 70~90자 권장 — 넘으면 검색결과에서 잘립니다) */
  description:
    '학교폭력 사건만 집중적으로 다루는 변호사가 학폭위 대응, 조치 불복 행정심판·행정소송, 피해학생 보호조치까지 전 과정을 함께합니다. 초기 대응이 결과를 바꿉니다.',
  locale: 'ko_KR',
  lang: 'ko',
} as const;

export const CONTACT = {
  /** 표시용 전화번호 */
  phone: '02-000-0000', // TODO
  /** tel: 링크용 (숫자만) */
  phoneHref: '+8220000000', // TODO
  /** 카카오톡 채널 상담 링크. 없으면 빈 문자열 '' 로 두면 버튼이 숨겨집니다. */
  kakao: 'https://pf.kakao.com/_xxxxxxx', // TODO
  email: 'contact@example.com', // TODO
  /** 상담 가능 시간 (JSON-LD openingHours 에도 사용) */
  hours: '평일 09:00 – 18:00',
} as const;

export const ADDRESS = {
  street: '서초구 서초대로 000, 0층', // TODO
  city: '서울특별시', // TODO
  region: '서울', // TODO
  postalCode: '06000', // TODO
  country: 'KR',
  /** 지도 표시용 좌표 (선택). 모르면 그대로 두거나 null 로 설정 */
  lat: 37.4923,
  lng: 127.0292,
} as const;

/** 대표 변호사 정보 — Attorney 구조화 데이터에 사용 */
export const ATTORNEY = {
  name: '홍길동', // TODO
  jobTitle: '대표변호사',
  /** 약력 한 줄 */
  bio: '학교폭력 사건 전담. 학교폭력대책심의위원회 대응 및 조치 불복 사건을 주로 수행합니다.', // TODO
  /** 프로필 사진 경로 (public 기준). 없으면 '' */
  photo: '',
} as const;

/**
 * 상담신청 폼이 데이터를 보낼 주소.
 * 정적 사이트라 서버가 없으므로 외부 폼 서비스를 씁니다.
 *  - Web3Forms(무료): https://web3forms.com  → access_key 발급 후 아래 endpoint 유지 + accessKey 입력
 *  - Formspree      : https://formspree.io   → endpoint 를 form 주소로 교체하고 accessKey 는 '' 로
 * 값이 비어 있으면 폼은 "전화/카카오톡으로 문의" 안내만 표시합니다.
 */
export const FORM = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: '', // TODO: Web3Forms access key
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
  { label: '칼럼', href: '/column/' },
  { label: '변호사 소개', href: '/about/' },
  { label: '상담신청', href: '/contact/' },
] as const;

/** 절대 URL 생성 헬퍼 */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL + '/').href;
}
