import { promises as fs } from 'fs';
import path from 'path';
import { optimizeImage } from './imageOptimizer';
import { RESPONSIVE_BREAKPOINTS } from './imageTypes';
import type { 
  OptimizedImageResult, 
  ImageOptimizationOptions 
} from './imageTypes';

/**
 * Generate responsive images for all breakpoints
 */
export async function generateResponsiveImages(
  inputPath: string,
  outputDir: string,
  baseName: string,
  options: Partial<ImageOptimizationOptions> = {}
): Promise<Record<string, OptimizedImageResult>> {
  const results: Record<string, OptimizedImageResult> = {};
  
  for (const [breakpoint, dimensions] of Object.entries(RESPONSIVE_BREAKPOINTS)) {
    const outputPath = path.join(outputDir, `${baseName}-${breakpoint}.webp`);
    
    try {
      const result = await optimizeImage(inputPath, outputPath, {
        ...dimensions,
        ...options
      });
      results[breakpoint] = result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error generating ${breakpoint} image:`, error);
    }
  }
  
  return results;
}

/**
 * Batch optimize multiple images
 */
export async function batchOptimizeImages(
  inputDir: string,
  outputDir: string,
  options: Partial<ImageOptimizationOptions> = {}
): Promise<OptimizedImageResult[]> {
  try {
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|tiff|bmp)$/i.test(file)
    );
    
    const results: OptimizedImageResult[] = [];
    
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const baseName = path.parse(file).name;
      const outputPath = path.join(outputDir, `${baseName}.webp`);
      
      try {
        const result = await optimizeImage(inputPath, outputPath, options);
        results.push(result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error processing ${file}:`, error);
      }
    }
    
    return results;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in batch optimization:', error);
    return [];
  }
}
