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
const NAME = '학교폭력변호사 전수민';
const TAGLINE = '교사 · 서울시교육청 출신 학교폭력변호사';
const LINE1 = '아이의 3년이';
const LINE2 = '몇 주 안에 결정됩니다';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const FONT = 'Malgun Gothic, Apple SD Gothic Neo, sans-serif';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.18" cy="0.12" r="0.85">
      <stop offset="0%" stop-color="#241d10"/>
      <stop offset="100%" stop-color="#08090b"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#08090b"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(80 108) scale(1.05)">
    <g stroke="#d9b26a" stroke-width="3.6" stroke-linecap="round" fill="none">
      <path d="M32 16V49"/>
      <path d="M14 20h36"/>
      <path d="M21 52h22"/>
    </g>
    <circle cx="32" cy="14.5" r="4" fill="#d9b26a"/>
    <path d="M7 24h14a7 7 0 0 1-14 0z" fill="#d9b26a"/>
    <path d="M43 24h14a7 7 0 0 1-14 0z" fill="#d9b26a"/>
  </g>
  <text x="80" y="272" font-family="${FONT}" font-size="72" font-weight="bold" fill="#f4f6f9">${esc(LINE1)}</text>
  <text x="80" y="366" font-family="${FONT}" font-size="72" font-weight="bold" fill="#d9b26a">${esc(LINE2)}</text>
  <text x="80" y="452" font-family="${FONT}" font-size="30" fill="#a5aebc">${esc(TAGLINE)}</text>
  <rect x="80" y="500" width="1040" height="1" fill="#232830"/>
  <text x="80" y="556" font-family="${FONT}" font-size="34" font-weight="bold" fill="#f4f6f9">${esc(NAME)}</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-default.png');
await writeFile('public/og-default.svg', svg);
console.log('생성 완료: public/og-default.png (1200x630)');
