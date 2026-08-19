import { test, expect } from '@playwright/test';
import { PostsModule } from './pages/PostsModule';

test.describe('Edit a test post', () => {
  test('should allow the user to input new post data, save it, and display it on the Posts page', async ({ page }) => {
    const postsModule = new PostsModule(page);

    const initialTitle = 'My First Post';
    const updatedPostData = {
      title: 'My Edited Post',
      author: 'Test Author',
      imageUrl: 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop',
      content: 'This is a test blog post written by an automated test',
      channelName: 'general',
    };

    // 1. Visit the posts list
    await postsModule.gotoList();

    // 2. Open post by initial title
    await postsModule.openPostByTitle(initialTitle);

    // 3. Navigate into edit form
    await postsModule.enterEditMode();

    // 4. Update data & save
    await postsModule.fillPostForm(updatedPostData);
    await postsModule.saveChanges();
  });
});