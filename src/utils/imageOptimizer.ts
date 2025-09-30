import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import type { 
  ImageOptimizationOptions, 
  OptimizedImageResult
} from './imageTypes';
import { DEFAULT_OPTIONS } from './imageTypes';

/**
 * Optimize a single image with Sharp
 */
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Get original image metadata (for future use)
    await sharp(inputPath).metadata();
    
    // Optimize the image
    const optimizedBuffer = await sharp(inputPath)
      .resize(opts.width, opts.height, {
        fit: opts.fit,
        position: 'center'
      })
      .toFormat(opts.format, {
        quality: opts.quality,
        progressive: true
      })
      .toBuffer();
    
    // Write optimized image
    await fs.writeFile(outputPath, optimizedBuffer);
    
    // Get optimized image stats
    const stats = await fs.stat(outputPath);
    
    return {
      src: outputPath,
      width: opts.width,
      height: opts.height,
      format: opts.format,
      size: stats.size,
      alt: path.basename(inputPath, path.extname(inputPath))
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error optimizing image ${inputPath}:`, error);
    throw error;
  }
}

/**
 * Generate thumbnail for gallery display
 */
export async function generateThumbnail(
  inputPath: string,
  outputPath: string,
  size: number = 300
): Promise<OptimizedImageResult> {
  return optimizeImage(inputPath, outputPath, {
    width: size,
    height: size,
    quality: 90,
    format: 'webp',
    fit: 'cover'
  });
}

/**
 * Generate placeholder image with blur effect
 */
export async function generatePlaceholder(
  inputPath: string,
  _outputPath: string,
  size: number = 20
): Promise<string> {
  try {
    const placeholderBuffer = await sharp(inputPath)
      .resize(size, size, { fit: 'cover' })
      .blur(2)
      .jpeg({ quality: 50 })
      .toBuffer();
    
    // Convert to base64 data URL
    const base64 = placeholderBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating placeholder:', error);
    return '';
  }
}

/**
 * Get image dimensions without loading full image
 */
export async function getImageDimensions(inputPath: string): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(inputPath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting image dimensions:', error);
    return { width: 0, height: 0 };
  }
}

/**
 * Validate image file
 */
export async function validateImage(inputPath: string): Promise<boolean> {
  try {
    const metadata = await sharp(inputPath).metadata();
    return !!(metadata.width && metadata.height);
  } catch {
    return false;
  }
}
