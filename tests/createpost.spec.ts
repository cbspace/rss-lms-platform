import { test, expect } from '@playwright/test';
import { PostsModule } from './pages/PostsModule';

test.describe('Create a test post', () => {
  test('should allow the user to input post data, save it, and display it on the Posts page', async ({ page }) => {
    const postsModule = new PostsModule(page);

    const postData = {
      title: 'My First Post',
      author: 'Test Author',
      imageUrl: 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop',
      content: 'This is a test blog post written by an automated test',
      channelName: 'general',
    };

    // 1. Visit the Create Post page
    await postsModule.gotoCreate();

    // 2. Fill in the form fields
    await postsModule.fillPostForm(postData);

    // 3. Publish the post
    await postsModule.publishPost();
  });
});