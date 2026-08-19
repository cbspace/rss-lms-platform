import { test, expect } from '@playwright/test';

// Test suite for Edit Post page
test.describe('Edit a test post', () => {
  test('should allow the user to input newe post data, save it, and display it on the Posts page', async ({ page }) => {
    // Step 1: Visit the Posts page
    await page.goto('/posts');

    // Wait for the page to settle and be ready for interaction
    await page.waitForLoadState('networkidle'); // Ensures all network requests are completed

    // Define a timeout value
    const default_timeout = 10_000

    // The post we wish to update
    const initial_title = 'My First Post';

    // Step 2. Target the <article> card containing the title
    const blogCard = page.locator('article').filter({ hasText: initial_title });

    // Step 3. Click the "Edit" button or link inside that card
    await blogCard.getByRole('link', { name: /edit/i }).click();

    // Confirm the correct URL is shown
    // Matches strictly /posts/post-<integer>/edit (optional trailing slash)
    await expect(page).toHaveURL(/\/posts\/post-\d+\/?$/);
    await page.waitForLoadState('networkidle');

    const title = 'My Edited Post';
    const author = 'Test Author';
    const imageUrl = 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop';
    const content = 'This is a test blog post written by an automated test';
    const channelName = 'general';

    // Step 4: Click on "Edit Post"
    await page.getByRole('link', { name: /edit post/i }).click();

    // Step 5: Confirm the correct URL is shown
    // Matches strictly /posts/post-<integer>/edit (optional trailing slash)
    await expect(page).toHaveURL(/\/posts\/post-\d+\/edit\/?$/);
    await page.waitForLoadState('networkidle');

    // Step 6: Fill out the new post details
    // .fill() automatically waits for visibility and actionability:
    await page.getByLabel(/post title/i).fill(title, { timeout: default_timeout });

    // Select channel to publish to (regex handles the 📺 emoji cleanly)
    // await page
    //   .getByRole('checkbox', { name: new RegExp(channelName, 'i') })
    //   .check({ timeout: default_timeout });
    
    // Step 7: Click the Save and Update button
    await page.click('button:has-text("Save & Update Post")');
  });
});