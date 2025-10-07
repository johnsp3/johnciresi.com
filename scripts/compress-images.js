#!/usr/bin/env node

/**
 * Image Compression Script
 * Compresses all images in the public/images directory
 * Uses Sharp for high-quality compression
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images-optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Compression settings
const COMPRESSION_SETTINGS = {
  png: {
    quality: 90,
    compressionLevel: 9,
    progressive: true,
  },
  jpg: {
    quality: 85,
    progressive: true,
    mozjpeg: true,
  },
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true,
  },
  webp: {
    quality: 80,
    effort: 6,
  },
};

// Supported image formats
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'];

/**
 * Recursively find all image files
 */
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImageFiles(filePath, fileList);
    } else if (SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Compress a single image
 */
async function compressImage(inputPath, _outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const relativePath = path.relative(IMAGES_DIR, inputPath);
    const outputFilePath = path.join(OUTPUT_DIR, relativePath);
    
    // Create output directory structure
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let sharpInstance = sharp(inputPath);
    
    // Apply compression based on format
    if (ext === '.png') {
      sharpInstance = sharpInstance.png(COMPRESSION_SETTINGS.png);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      sharpInstance = sharpInstance.jpeg(COMPRESSION_SETTINGS.jpg);
    } else if (ext === '.webp') {
      sharpInstance = sharpInstance.webp(COMPRESSION_SETTINGS.webp);
    }
    
    await sharpInstance.toFile(outputFilePath);
    
    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputFilePath).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${relativePath}: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (${compressionRatio}% reduction)`);
    
    return {
      originalSize,
      compressedSize,
      compressionRatio: parseFloat(compressionRatio),
    };
  } catch (error) {
    console.error(`❌ Error compressing ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Main compression function
 */
async function compressAllImages() {
  console.log('🚀 Starting image compression...\n');
  
  const imageFiles = findImageFiles(IMAGES_DIR);
  console.log(`Found ${imageFiles.length} images to compress\n`);
  
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let successCount = 0;
  
  for (const imagePath of imageFiles) {
    const result = await compressImage(imagePath);
    if (result) {
      totalOriginalSize += result.originalSize;
      totalCompressedSize += result.compressedSize;
      successCount++;
    }
  }
  
  console.log('\n📊 Compression Summary:');
  console.log(`✅ Successfully compressed: ${successCount}/${imageFiles.length} images`);
  console.log(`📦 Total size reduction: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalCompressedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`💾 Space saved: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)}MB (${(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100).toFixed(1)}%)`);
  console.log(`\n🎉 Compression complete! Optimized images saved to: ${OUTPUT_DIR}`);
}

// Run the compression
compressAllImages().catch(console.error);
