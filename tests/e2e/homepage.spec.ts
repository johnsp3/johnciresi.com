import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('has correct title and meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/John Ciresi/);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /John Ciresi.*Musician/);
    
    // Check canonical URL
    const canonicalLink = page.locator('link[rel="canonical"]');
    await expect(canonicalLink).toHaveAttribute('href', /johnciresi\.com/);
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation is visible
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Test navigation links
    const musicLink = page.locator('a[href="#music"]');
    await expect(musicLink).toBeVisible();
    
    const aboutLink = page.locator('a[href="#about"]');
    await expect(aboutLink).toBeVisible();
    
    const contactLink = page.locator('a[href="#contact"]');
    await expect(contactLink).toBeVisible();
  });

  test('hero section displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check hero title
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('JOHN CIRESI');
    
    // Check hero subtitle
    const heroSubtitle = page.locator('text=Singer-songwriter, guitarist, and producer');
    await expect(heroSubtitle).toBeVisible();
    
    // Check CTA button
    const ctaButton = page.locator('a[href="#music"]');
    await expect(ctaButton).toContainText('Explore Music');
  });

  test('music section displays albums', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to music section
    await page.locator('#music').scrollIntoViewIfNeeded();
    
    // Check if albums are displayed
    const albumCards = page.locator('[data-testid="album-card"]');
    await expect(albumCards).toHaveCountGreaterThan(0);
    
    // Check album information
    const firstAlbum = albumCards.first();
    await expect(firstAlbum).toBeVisible();
  });

  test('contact form works', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    // Check form elements
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    
    const messageTextarea = page.locator('textarea[name="message"]');
    await expect(messageTextarea).toBeVisible();
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('footer displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check copyright
    const copyright = page.locator('text=© 2025 John Ciresi');
    await expect(copyright).toBeVisible();
    
    // Check privacy policy link
    const privacyLink = page.locator('a[href="/privacy-policy"]');
    await expect(privacyLink).toBeVisible();
  });
});
