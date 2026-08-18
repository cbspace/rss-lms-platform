import { test, expect } from '@playwright/test';

// Test suite for Create Post page
test.describe('Create a test post', () => {
  test('should allow the user to input post data, save it, and display it on the Posts page', async ({ page }) => {
    // Step 1: Visit the Create Post page
    await page.goto('/posts/create');

    // Wait for the page to settle and be ready for interaction
    await page.waitForLoadState('networkidle'); // Ensures all network requests are completed

    // Define a timeout value
    const default_timeout = 10_000

    // Step 2: Fill in the form fields
    const title = 'My First Post';
    const author = 'Test Author';
    const imageUrl = 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop';
    const content = 'This is a test blog post written by an automated test';
    const channelName = 'general';

    // Ensure the form elements are visible and ready to interact
    // .fill() automatically waits for visibility and actionability:
    await page.getByPlaceholder('Short Post Title').fill(title, {timeout: default_timeout});
    await page.getByPlaceholder('Course Instructor').fill(author, {timeout: default_timeout});
    await page.getByPlaceholder('https://images.unsplash.com/...').fill(imageUrl, {timeout: default_timeout});
    await page.getByPlaceholder('Write your announcement or Post content...').fill(content, {timeout: default_timeout});

    // Select channel to publish to (regex handles the 📺 emoji cleanly)
    await page
      .getByRole('checkbox', { name: new RegExp(channelName, 'i') })
      .check({ timeout: default_timeout });
    
    // Step 3: Click the "Add Data" button
    await page.click('button:has-text("Publish Post & Update RSS Feeds")');
  });
});