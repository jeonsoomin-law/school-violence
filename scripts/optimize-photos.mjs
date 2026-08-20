/**
 * 원본 사진(수 MB)을 웹용으로 잘라내고 압축합니다.
 * 원본 폴더는 저장소에 올리지 않고, 결과물만 public/images/ 에 들어갑니다.
 *
 * 실행:  node scripts/optimize-photos.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/images';
await mkdir(OUT, { recursive: true });

/** 원본 3360x5040 기준 크롭 좌표 */
const jobs = [
  {
    src: '프로필 사진/CSY_6175-1.jpg',
    out: 'attorney-hero',
    crop: { left: 333, top: 500, width: 2560, height: 3400 }, // 3:4, 팔짱 컷
    width: 1000,
    quality: 74,
  },
  {
    src: '프로필 사진/CSY_6067-1.jpg',
    out: 'attorney-portrait',
    crop: { left: 333, top: 500, width: 2560, height: 3200 }, // 4:5, 미소 컷
    width: 760,
    quality: 76,
  },
];

for (const job of jobs) {
  const base = sharp(job.src).extract(job.crop).resize({ width: job.width });

  await base.clone().webp({ quality: job.quality }).toFile(`${OUT}/${job.out}.webp`);
  await base.clone().jpeg({ quality: job.quality + 6, mozjpeg: true }).toFile(`${OUT}/${job.out}.jpg`);

  const meta = await sharp(`${OUT}/${job.out}.webp`).metadata();
  const { size: webpSize } = await sharp(`${OUT}/${job.out}.webp`).toBuffer({ resolveWithObject: true }).then((r) => ({ size: r.data.length }));
  console.log(`${job.out}  ${meta.width}x${meta.height}  webp ${Math.round(webpSize / 1024)}KB`);
}

console.log('완료: public/images/');
