/**
 * 위촉장·표창장 스캔본을 웹용으로 압축합니다.
 * 원본 폴더(위촉장/, 표창장/)는 저장소에 올리지 않고 결과물만 public/images/credentials/ 에 들어갑니다.
 *
 * 실행:  node scripts/optimize-credentials.mjs
 *
 * ⚠️ 제외한 원본 (추가하지 마세요)
 *  - 위촉장(광진경찰서 선도심사위원).jpg  → 자택 주소가 인쇄돼 있음
 *  - 9. 대한변호사협회 연수강사_1.jpg     → 대한변협신문 기사 캡처(무단전재 금지)
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/images/credentials';
await mkdir(OUT, { recursive: true });

/** [원본경로, 출력파일명] */
const items = [
  ['표창장/표창장(교육부).jpg', 'moe-commendation'],
  ['위촉장/1. 위촉장(교육부).jpg', 'moe-legal-support'],
  ['표창장/감사장(서울지방경찰청-2).jpg', 'spa-thanks-2013'],
  ['표창장/감사장(서울지방경찰청-1).jpg', 'spa-thanks-2017'],
  ['위촉장/위촉장(서울시교육청 사안처리지원단) (2).jpg', 'sen-support-2015'],
  ['위촉장/2. 위촉장(서울시교육청 본청 사안처리지원단).jpg', 'sen-support-2016'],
  ['위촉장/위촉장(서울시교육청 사안처리지원단).jpg', 'sen-support-2017'],
  ['위촉장/4. 위촉장(서울시교육청 교권보호위원).jpg', 'sen-teacher-rights'],
  ['위촉장/3. 위촉장(서울시교육청 사학자문위원).jpg', 'sen-private-school'],
  ['위촉장/6. 위촉장(보상심사위원).jpg', 'safety-fund-2013'],
  ['위촉장/위촉장(서울시교육청 보상심사위원).jpg', 'safety-fund-2015'],
  ['위촉장/5. 위촉장(선도심사위원).jpg', 'gwangjin-police'],
  ['위촉장/7. 위촉장(한국교총).jpg', 'kfta-counsel'],
  ['위촉장/8. 위촉장(대전시교육감).jpg', 'daejeon-lecturer'],
];

let total = 0;
for (const [src, out] of items) {
  // 목록용 썸네일
  await sharp(src).resize({ width: 440 }).webp({ quality: 74 }).toFile(`${OUT}/${out}.webp`);
  // 크게 보기용
  await sharp(src).resize({ width: 1100 }).webp({ quality: 76 }).toFile(`${OUT}/${out}-lg.webp`);

  const [a, b] = await Promise.all([
    sharp(`${OUT}/${out}.webp`).toBuffer(),
    sharp(`${OUT}/${out}-lg.webp`).toBuffer(),
  ]);
  total += a.length + b.length;
  console.log(`${out.padEnd(22)} thumb ${Math.round(a.length / 1024)}KB  full ${Math.round(b.length / 1024)}KB`);
}
console.log(`\n완료: ${items.length}건, 합계 ${Math.round(total / 1024)}KB → ${OUT}/`);
