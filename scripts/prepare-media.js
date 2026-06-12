import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../Videos');
const destDir = path.join(__dirname, '../public/videos');

const mapping = {
  '1. Intro To Sikkim.mp4': '1_intro_to_sikkim.mp4',
  '2. The People.mp4': '2_the_people.mp4',
  '3. seven sisters waterfall.mp4': '3_seven_sisters_waterfall.mp4',
  '4. Lachung .mp4': '4_lachung.mp4',
  '5. Yumthang Valley.mp4': '5_yumthang_valley.mp4',
  '6.Zero Point.mp4': '6_zero_point.mp4',
  '7. Tsomgo lake.mp4': '7_tsomgo_lake.mp4',
  '8. The journey.mp4': '8_the_journey.mp4',
  '9. The Mountain.mp4': '9_the_mountain.mp4',
  '10. Zuluk.mp4': '10_zuluk.mp4'
};

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Starting media preparation...');

for (const [srcName, destName] of Object.entries(mapping)) {
  const srcPath = path.join(sourceDir, srcName);
  const destPath = path.join(destDir, destName);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied & renamed: ${srcName} -> ${destName}`);
  } else {
    console.error(`Error: Source file does not exist: ${srcPath}`);
  }
}

console.log('Media preparation completed!');
