import { test, expect } from '@playwright/test';

test.describe('Audio Player', () => {
  test('opens when album card is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Scroll to music section
    await page.locator('#music').scrollIntoViewIfNeeded();
    
    // Wait for album cards to load
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 });
    
    // Click first album card
    const firstAlbumCard = page.locator('[data-testid="album-card"]').first();
    await firstAlbumCard.click();
    
    // Check if audio player modal opens
    const audioPlayer = page.locator('[data-testid="audio-player"]');
    await expect(audioPlayer).toBeVisible({ timeout: 5000 });
  });

  test('displays album information in player', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open audio player
    await page.locator('#music').scrollIntoViewIfNeeded();
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 });
    await page.locator('[data-testid="album-card"]').first().click();
    
    // Check album title in player
    const playerTitle = page.locator('[data-testid="audio-player"] h2');
    await expect(playerTitle).toBeVisible();
    
    // Check track list
    const trackList = page.locator('[data-testid="track-list"]');
    await expect(trackList).toBeVisible();
  });

  test('audio controls work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open audio player
    await page.locator('#music').scrollIntoViewIfNeeded();
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 });
    await page.locator('[data-testid="album-card"]').first().click();
    
    // Check play button
    const playButton = page.locator('[data-testid="play-button"]');
    await expect(playButton).toBeVisible();
    
    // Check previous/next buttons
    const prevButton = page.locator('[data-testid="prev-button"]');
    const nextButton = page.locator('[data-testid="next-button"]');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Check progress bar
    const progressBar = page.locator('[data-testid="progress-bar"]');
    await expect(progressBar).toBeVisible();
  });

  test('closes when close button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open audio player
    await page.locator('#music').scrollIntoViewIfNeeded();
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 });
    await page.locator('[data-testid="album-card"]').first().click();
    
    // Wait for player to open
    await page.waitForSelector('[data-testid="audio-player"]', { timeout: 5000 });
    
    // Click close button
    const closeButton = page.locator('[data-testid="close-button"]');
    await closeButton.click();
    
    // Check if player is closed
    const audioPlayer = page.locator('[data-testid="audio-player"]');
    await expect(audioPlayer).not.toBeVisible();
  });

  test('closes when escape key is pressed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open audio player
    await page.locator('#music').scrollIntoViewIfNeeded();
    await page.waitForSelector('[data-testid="album-card"]', { timeout: 10000 });
    await page.locator('[data-testid="album-card"]').first().click();
    
    // Wait for player to open
    await page.waitForSelector('[data-testid="audio-player"]', { timeout: 5000 });
    
    // Press escape key
    await page.keyboard.press('Escape');
    
    // Check if player is closed
    const audioPlayer = page.locator('[data-testid="audio-player"]');
    await expect(audioPlayer).not.toBeVisible();
  });
});
