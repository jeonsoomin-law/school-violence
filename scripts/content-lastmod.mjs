/**
 * 사이트맵의 <lastmod>(마지막 수정일)를 페이지마다 실제 값으로 채우기 위한 날짜표를 만듭니다.
 * astro.config.mjs 의 sitemap 설정에서 불러 씁니다. 따로 실행할 일은 없습니다.
 *
 * 왜 필요한가:
 *   예전에는 모든 페이지의 lastmod 가 "배포한 시각" 으로 똑같이 찍혔습니다.
 *   글 하나만 저장해도 80여 개 페이지가 전부 "방금 수정됨" 으로 보이니
 *   검색엔진이 어떤 글이 새 글인지 구분할 수 없고, 결국 lastmod 값을 믿지 않게 됩니다.
 *
 * 날짜를 정하는 방법:
 *   1. 그 글 파일이 마지막으로 커밋된 시각 (관리자 화면에서 저장한 시각과 같습니다)
 *      → 변호사님이 따로 "수정일" 을 입력하지 않아도 글을 고칠 때마다 자동으로 갱신됩니다.
 *   2. git 이력을 못 쓰는 환경(얕은 클론, 커밋 전 파일)이면 updatedDate → publishDate 순으로 대신 씁니다.
 *
 * 목록 페이지(/case/ 등)와 홈은 그 안에 보이는 글 중 가장 최근 날짜를 씁니다.
 * 날짜를 알 수 없는 페이지(소개·상담 등)는 lastmod 를 아예 넣지 않습니다. (틀린 값보다 없는 편이 낫습니다)
 *
 * ⚠️ GitHub Actions 에서는 actions/checkout 에 fetch-depth: 0 이 있어야 1번 방식이 동작합니다.
 *    (기본값인 얕은 클론이면 모든 파일이 마지막 커밋 하나에 들어 있는 것처럼 보여 날짜가 전부 같아집니다)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = 'src/content';

/** 컬렉션 → 상세 페이지 주소 앞부분. 상세 페이지가 없는 컬렉션은 null */
const DETAIL_PREFIX = { case: '/case/', column: '/column/', service: '/service/', review: null };

/** 목록 페이지 → 그 페이지에 글이 나오는 컬렉션들 */
const LIST_PAGES = {
  '/': ['case', 'column', 'service', 'review'],
  '/case/': ['case'],
  '/column/': ['column'],
  '/service/': ['service'],
  '/review/': ['review'],
  '/school-violence/': ['column', 'service'],
};

/** 파일 경로(src/content/... , 슬래시 구분) → 마지막 커밋 시각. git 을 못 쓰면 null */
function gitCommitDates() {
  const git = (args) =>
    execFileSync('git', ['-c', 'core.quotepath=off', ...args], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') {
      console.warn(
        '[sitemap] 얕은 클론이라 git 이력으로 수정일을 알 수 없어 글의 publishDate/updatedDate 를 씁니다. ' +
          '(GitHub Actions 라면 actions/checkout 에 fetch-depth: 0 을 넣으세요)',
      );
      return null;
    }
    // 최신 커밋부터 나오므로, 파일이 처음 등장한 줄이 그 파일의 마지막 수정 시각입니다.
    const out = git(['log', '--format=@%cI', '--name-only', '--no-renames', '--', CONTENT_DIR]);
    const dates = new Map();
    let current = null;
    for (const line of out.split('\n')) {
      if (line.startsWith('@')) current = new Date(line.slice(1));
      else if (line.trim() && current && !dates.has(line.trim())) dates.set(line.trim(), current);
    }
    return dates;
  } catch {
    console.warn('[sitemap] git 을 실행할 수 없어 글의 publishDate/updatedDate 로 수정일을 정합니다.');
    return null;
  }
}

/** 머리말(--- 사이 YAML)에서 한 줄짜리 값만 꺼냅니다. 이 용도엔 slug·날짜·draft 만 있으면 됩니다. */
function frontmatterValue(frontmatter, key) {
  const m = frontmatter.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  if (!m) return undefined;
  const v = m[1].trim().replace(/^(['"])(.*)\1$/, '$2');
  return v === '' ? undefined : v;
}

function toDate(v) {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * @returns {Map<string, string>} 경로(예: /case/foo/) → ISO 시각 문자열
 */
export function contentLastmod() {
  const commitDates = gitCommitDates();
  /** @type {Map<string, Date>} */
  const byPath = new Map();
  /** @type {Record<string, Date[]>} */
  const byCollection = {};

  const keep = (p, d) => {
    const prev = byPath.get(p);
    if (!prev || d > prev) byPath.set(p, d);
  };

  for (const [collection, prefix] of Object.entries(DETAIL_PREFIX)) {
    const dir = path.join(CONTENT_DIR, collection);
    if (!existsSync(dir)) continue;
    byCollection[collection] = [];

    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const text = readFileSync(path.join(dir, file), 'utf8');
      const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      if (frontmatterValue(fm, 'draft') === 'true') continue;

      const date =
        commitDates?.get(`${CONTENT_DIR}/${collection}/${file}`) ??
        toDate(frontmatterValue(fm, 'updatedDate')) ??
        toDate(frontmatterValue(fm, 'publishDate'));
      if (!date) continue;

      byCollection[collection].push(date);
      if (prefix) {
        // Astro 는 머리말의 slug 를 주소로 쓰고, 없으면 파일 이름을 씁니다.
        const id = frontmatterValue(fm, 'slug') ?? file.replace(/\.md$/, '').toLowerCase();
        keep(`${prefix}${id}/`, date);
      }
    }
  }

  for (const [page, collections] of Object.entries(LIST_PAGES)) {
    for (const c of collections) for (const d of byCollection[c] ?? []) keep(page, d);
  }

  return new Map([...byPath].map(([p, d]) => [p, d.toISOString()]));
}
