/**
 * 분류(카테고리) 목록.
 *
 * 실제 목록은 categories.json 에 있고, 관리자 화면(CMS)의 "분류 관리" 메뉴에서
 * 변호사님이 직접 추가·수정·순서변경할 수 있습니다. 이 파일은 그 JSON 을 읽어
 * 사이트에서 쓰기 좋은 형태로 바꿔주는 역할만 합니다. 여기는 손대지 않아도 됩니다.
 */
import categories from './categories.json';

const names = (list: { name: string }[]) => list.map((c) => c.name);

/** 칼럼 분류 — 관리자 화면에 등록된 순서 그대로 */
export const columnCategories = names(categories.column);
/** 해결사례 사건 유형 */
export const caseCategories = names(categories.case);
/** 의뢰인 후기 사건 유형 */
export const reviewCategories = names(categories.review);

/**
 * 글에 실제로 쓰인 분류를 "분류 관리"에 등록된 순서대로 정렬한다.
 *
 * 등록된 목록에 없는 분류(관리자가 분류를 지웠거나 이름을 바꿨는데 옛 글이
 * 그대로 남아 있는 경우)는 글이 사라지지 않도록 맨 뒤에 붙이고,
 * 배포 로그에 경고를 남긴다. 빌드를 실패시키지는 않는다.
 */
export function orderCategories(used: string[], defined: string[], label: string): string[] {
  const unique = [...new Set(used)];
  const orphans = warnUnknownCategories(unique, defined, label);
  return [...defined.filter((c) => unique.includes(c)), ...orphans];
}

/**
 * "분류 관리"에 없는 분류가 쓰이고 있으면 배포 로그에 경고를 남기고 그 목록을 돌려준다.
 * 분류 이름의 오타나, 지워진 분류를 아직 쓰고 있는 글을 잡아내기 위한 장치다.
 */
export function warnUnknownCategories(used: string[], defined: string[], label: string): string[] {
  const orphans = [...new Set(used)].filter((c) => !defined.includes(c));
  if (orphans.length > 0) {
    console.warn(
      `\n[분류 확인] ${label}: "분류 관리"에 없는 분류가 쓰이고 있습니다 → ${orphans.join(', ')}\n` +
        `  관리자 화면 → 분류 관리 에서 다시 추가하거나, 해당 글의 분류를 바꿔주세요.\n`,
    );
  }
  return orphans;
}
