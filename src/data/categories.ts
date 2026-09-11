/**
 * 분류(카테고리) 목록.
 *
 * 칼럼·해결사례·후기가 모두 이 하나의 목록을 함께 씁니다.
 * 실제 목록은 categories.json 에 있고, 관리자 화면(CMS)의 "분류 관리" 메뉴에서
 * 직접 추가·수정·순서변경할 수 있습니다. 이 파일은 손대지 않아도 됩니다.
 */
import categories from './categories.json';

/** 등록된 순서 그대로의 분류 이름 목록 */
export const allCategories: string[] = categories.categories.map((c) => c.name);

/** 게시판 이름 표기 */
export const BOARD_LABEL = {
  column: '칼럼',
  case: '해결사례',
  review: '의뢰인 후기',
} as const;

export type BoardKey = keyof typeof BOARD_LABEL;

/**
 * 글에 실제로 쓰인 분류를 "분류 관리"에 등록된 순서대로 정렬한다.
 *
 * 등록된 목록에 없는 분류(관리자가 분류를 지웠거나 이름을 바꿨는데 옛 글이
 * 그대로 남아 있는 경우)는 글이 사라지지 않도록 맨 뒤에 붙이고,
 * 배포 로그에 경고를 남긴다. 빌드를 실패시키지는 않는다.
 */
export function orderCategories(used: string[], label: string): string[] {
  const unique = [...new Set(used)];
  const orphans = warnUnknownCategories(unique, label);
  return [...allCategories.filter((c) => unique.includes(c)), ...orphans];
}

/**
 * "분류 관리"에 없는 분류가 쓰이고 있으면 배포 로그에 경고를 남기고 그 목록을 돌려준다.
 * 분류 이름의 오타나, 지워진 분류를 아직 쓰고 있는 글을 잡아내기 위한 장치다.
 */
export function warnUnknownCategories(used: string[], label: string): string[] {
  const orphans = [...new Set(used)].filter((c) => !allCategories.includes(c));
  if (orphans.length > 0) {
    console.warn(
      `\n[분류 확인] ${label}: "분류 관리"에 없는 분류가 쓰이고 있습니다 → ${orphans.join(', ')}\n` +
        `  관리자 화면 → 분류 관리 에서 다시 추가하거나, 해당 글의 분류를 바꿔주세요.\n`,
    );
  }
  return orphans;
}
