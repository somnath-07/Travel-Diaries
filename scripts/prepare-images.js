import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '../images');
const destDir = path.join(__dirname, '../public/images');
const outputFile = path.join(__dirname, '../src/data/loaderImages.js');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Find all image files in rootDir
const files = fs.readdirSync(rootDir);
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const imageFiles = [];

files.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (imageExtensions.includes(ext)) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(destDir, file);
    
    // Copy the file
    fs.copyFileSync(srcPath, destPath);
    // Delete the file from root to clean up
    fs.unlinkSync(srcPath);
    
    imageFiles.push(`/images/${file}`);
    console.log(`Moved & registered: ${file}`);
  }
});

// Ensure directory src/data exists
const dataDir = path.dirname(outputFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate the output JavaScript file
const content = `export const loaderImages = ${JSON.stringify(imageFiles, null, 2)};\n`;
fs.writeFileSync(outputFile, content, 'utf8');

console.log(`Successfully generated loader images list containing ${imageFiles.length} images!`);
