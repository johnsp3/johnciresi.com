/**
 * Performance Budgets Configuration
 * Defines size limits for different asset types
 */

export const PERFORMANCE_BUDGETS = {
  // JavaScript bundle limits
  js: {
    maxSize: 500 * 1024, // 500KB
    warningSize: 400 * 1024, // 400KB
  },
  
  // CSS bundle limits
  css: {
    maxSize: 100 * 1024, // 100KB
    warningSize: 80 * 1024, // 80KB
  },
  
  // Image limits
  images: {
    maxSize: 2 * 1024 * 1024, // 2MB
    warningSize: 1.5 * 1024 * 1024, // 1.5MB
  },
  
  // Total page size limit
  total: {
    maxSize: 3 * 1024 * 1024, // 3MB
    warningSize: 2.5 * 1024 * 1024, // 2.5MB
  },
} as const;

export function checkPerformanceBudget(
  assetType: keyof typeof PERFORMANCE_BUDGETS,
  size: number
): { passed: boolean; warning: boolean; message: string } {
  const budget = PERFORMANCE_BUDGETS[assetType];
  
  if (size > budget.maxSize) {
    return {
      passed: false,
      warning: false,
      message: `❌ ${assetType.toUpperCase()} bundle exceeds budget: ${formatBytes(size)} > ${formatBytes(budget.maxSize)}`,
    };
  }
  
  if (size > budget.warningSize) {
    return {
      passed: true,
      warning: true,
      message: `⚠️ ${assetType.toUpperCase()} bundle approaching limit: ${formatBytes(size)} > ${formatBytes(budget.warningSize)}`,
    };
  }
  
  return {
    passed: true,
    warning: false,
    message: `✅ ${assetType.toUpperCase()} bundle within budget: ${formatBytes(size)}`,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
