/**
 * 기본 OG 이미지(카카오톡·페이스북 공유 썸네일)를 만듭니다.
 * 사무소명을 바꾼 뒤 다시 만들려면:  node scripts/generate-og.mjs
 *
 * 디자인된 이미지가 따로 있다면 public/og-default.png 를 그냥 덮어쓰면 됩니다.
 * (권장 크기 1200 x 630)
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// src/consts.ts 와 맞추세요.
const NAME = '학교폭력 법률센터';
const TAGLINE = '학교폭력 전담 변호사';
const LINE1 = '학폭위 대응부터';
const LINE2 = '조치 불복까지';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1f33"/>
      <stop offset="100%" stop-color="#1b4771"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="80" y="150" width="72" height="6" rx="3" fill="#a67c2e"/>
  <text x="80" y="270" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif"
        font-size="68" font-weight="bold" fill="#ffffff">${esc(LINE1)}</text>
  <text x="80" y="360" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif"
        font-size="68" font-weight="bold" fill="#ffffff">${esc(LINE2)}</text>
  <text x="80" y="450" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif"
        font-size="30" fill="#a9bed6">${esc(TAGLINE)}</text>
  <text x="80" y="545" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif"
        font-size="34" font-weight="bold" fill="#d9b26a">${esc(NAME)}</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-default.png');
await writeFile('public/og-default.svg', svg);
console.log('생성 완료: public/og-default.png (1200x630)');
