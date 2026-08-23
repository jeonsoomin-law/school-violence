/**
 * 기본 OG 이미지(카카오톡·페이스북 공유 썸네일)를 만듭니다.
 * 문구를 바꾼 뒤 다시 만들려면:  node scripts/generate-og.mjs
 *
 * 왼쪽에 문구, 오른쪽에 홈 첫 화면과 같은 변호사 사진이 들어갑니다.
 * 사진은 왼쪽 가장자리를 배경색으로 그라데이션 처리해 문구와 겹치지 않게 합니다.
 *
 * 디자인된 이미지가 따로 있다면 public/og-default.png 를 그냥 덮어쓰면 됩니다.
 * (권장 크기 1200 x 630)
 *
 * ⚠️ 이미지를 바꾼 뒤에는 src/layouts/BaseLayout.astro 의 OG_VERSION 을 올려야
 *    카카오톡·페이스북이 예전 썸네일을 계속 보여주지 않습니다.
 */
import sharp from 'sharp';

// src/consts.ts 와 맞추세요.
const NAME = '학교폭력변호사 전수민';
const TAGLINE = '교사 · 서울시교육청 출신 학교폭력변호사';
const LINE1 = '아이의 3년이';
const LINE2 = '몇 주 안에 결정됩니다';

/** 홈 첫 화면(hero)과 같은 컷 */
const PHOTO = 'public/images/attorney-hero.jpg';

const W = 1200;
const H = 630;
/** 오른쪽 사진 영역 */
const PHOTO_W = 500;
const PHOTO_X = W - PHOTO_W; // 700
/** 문구가 쓰이는 왼쪽 여백 안쪽 폭 */
const TEXT_X = 80;
const TEXT_W = 570;

const BG = '#08090b';
const GOLD = '#d9b26a';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const FONT = 'Malgun Gothic, Apple SD Gothic Neo, sans-serif';

/** 배경 + 문구 (사진은 아래에서 따로 얹습니다) */
const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="0.18" cy="0.12" r="0.85">
      <stop offset="0%" stop-color="#241d10"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g transform="translate(${TEXT_X} 100)">
    <g stroke="${GOLD}" stroke-width="3.6" stroke-linecap="round" fill="none">
      <path d="M32 16V49"/>
      <path d="M14 20h36"/>
      <path d="M21 52h22"/>
    </g>
    <circle cx="32" cy="14.5" r="4" fill="${GOLD}"/>
    <path d="M7 24h14a7 7 0 0 1-14 0z" fill="${GOLD}"/>
    <path d="M43 24h14a7 7 0 0 1-14 0z" fill="${GOLD}"/>
  </g>
  <text x="${TEXT_X}" y="268" font-family="${FONT}" font-size="54" font-weight="bold" fill="#f4f6f9">${esc(LINE1)}</text>
  <text x="${TEXT_X}" y="344" font-family="${FONT}" font-size="54" font-weight="bold" fill="${GOLD}">${esc(LINE2)}</text>
  <text x="${TEXT_X}" y="424" font-family="${FONT}" font-size="27" fill="#a5aebc">${esc(TAGLINE)}</text>
  <rect x="${TEXT_X}" y="480" width="${TEXT_W}" height="1" fill="#232830"/>
  <text x="${TEXT_X}" y="540" font-family="${FONT}" font-size="32" font-weight="bold" fill="#f4f6f9">${esc(NAME)}</text>
</svg>`;

/** 사진 왼쪽 가장자리를 배경색으로 녹이는 그라데이션 */
const fadeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_W}" height="${H}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BG}" stop-opacity="1"/>
      <stop offset="34%" stop-color="${BG}" stop-opacity="0.55"/>
      <stop offset="62%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${PHOTO_W}" height="${H}" fill="url(#fade)"/>
</svg>`;

const photo = await sharp(PHOTO)
  // 위쪽(얼굴) 기준으로 맞춰 잘라야 인물이 잘리지 않습니다.
  .resize({ width: PHOTO_W, height: H, fit: 'cover', position: 'top' })
  // 사진 배경(중간 회색)이 어두운 캔버스와 튀지 않도록 살짝 눌러줍니다.
  .modulate({ brightness: 0.9 })
  .composite([{ input: Buffer.from(fadeSvg) }])
  .png()
  .toBuffer();

await sharp(Buffer.from(bgSvg))
  .composite([{ input: photo, left: PHOTO_X, top: 0 }])
  .png()
  .toFile('public/og-default.png');

console.log(`생성 완료: public/og-default.png (${W}x${H})`);
