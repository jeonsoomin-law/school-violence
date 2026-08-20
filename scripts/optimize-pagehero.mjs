/**
 * 각 페이지 상단 배너(대표 이미지)를 웹용으로 만듭니다.
 * 원본(_p*.png)은 저장소에 올리지 않고 결과물만 public/images/page/ 에 남깁니다.
 *
 * 실행:  node scripts/optimize-pagehero.mjs
 *
 * 배너는 full-bleed 라 넓은 화면에서 세로가 많이 잘립니다(object-fit: cover).
 * 그래서 2.37:1 정도로 미리 잘라두고, 잘릴 위치가 중요한 컷만 position 을 지정합니다.
 */
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';

const OUT = 'public/images/page';
await mkdir(OUT, { recursive: true });

const W = 1800;
const H = 760;

const jobs = [
  // [원본, 출력명, 크롭 기준]
  ['_p1', 'school-violence', 'bottom'], // 위쪽 현수막에 깨진 글자가 있어 아래쪽 기준으로 자릅니다
  ['_p2', 'service', 'centre'],
  ['_p3', 'service-committee', 'centre'],
  ['_p4', 'service-accused', 'centre'],
  ['_p5', 'service-victim', 'centre'],
  ['_p6', 'service-appeal', 'centre'],
  ['_p7', 'service-cyber', 'centre'],
  ['_p8', 'service-criminal', 'centre'],
  ['_p9', 'case', 'centre'],
  ['_p10', 'column', 'centre'],
];

let total = 0;
for (const [src, out, position] of jobs) {
  const base = sharp(`public/images/${src}.png`).resize(W, H, { fit: 'cover', position });

  await base.clone().webp({ quality: 70 }).toFile(`${OUT}/${out}.webp`);
  await base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(`${OUT}/${out}.jpg`);

  const buf = await sharp(`${OUT}/${out}.webp`).toBuffer();
  total += buf.length;
  console.log(`${out.padEnd(20)} ${W}x${H}  webp ${Math.round(buf.length / 1024)}KB`);

  await rm(`public/images/${src}.png`, { force: true });
}
console.log(`\n완료: ${jobs.length}건, webp 합계 ${Math.round(total / 1024)}KB → ${OUT}/`);
