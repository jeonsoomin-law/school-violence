/**
 * 홈 사진 밴드용 이미지를 웹용으로 압축합니다.
 * 원본(_raw-*.png)은 저장소에 올리지 않고 결과물만 public/images/ 에 남깁니다.
 *
 * 실행:  node scripts/optimize-scenes.mjs
 */
import sharp from 'sharp';
import { rm } from 'node:fs/promises';

const OUT = 'public/images';

const jobs = [
  { src: `${OUT}/_raw-classroom.png`, out: 'scene-classroom' },
  { src: `${OUT}/_raw-hallway.png`, out: 'scene-hallway' },
  { src: `${OUT}/_raw-phone.png`, out: 'scene-phone' },
];

for (const job of jobs) {
  // 3:2 로 맞춰 900px 폭 (카드 한 칸이 최대 ~400px 이라 2배수면 충분)
  const base = sharp(job.src).resize({ width: 900, height: 600, fit: 'cover', position: 'centre' });

  await base.clone().webp({ quality: 72 }).toFile(`${OUT}/${job.out}.webp`);
  await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${job.out}.jpg`);

  const { size } = await sharp(`${OUT}/${job.out}.webp`)
    .toBuffer({ resolveWithObject: true })
    .then((r) => ({ size: r.data.length }));
  console.log(`${job.out}  900x600  webp ${Math.round(size / 1024)}KB`);

  await rm(job.src, { force: true });
}

console.log('완료: public/images/');
