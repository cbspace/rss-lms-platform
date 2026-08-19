import { test, expect } from '@playwright/test';
import { PostsModule } from './pages/PostsModule';

// Test Post Update
test.describe('Edit a test post', () => {
  test('should allow the user to input new post data, save it, and display it on the Posts page', async ({ page }) => {
    const postsModule = new PostsModule(page);

    // Details of a post to create
    const postData = {
      title: 'Test Post to Edit',
      author: 'Test Author',
      imageUrl: 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop',
      content: 'This is a test blog post written by an automated test',
      channelName: 'general',
    };

    // 1. Create Initial Post
    await postsModule.gotoCreate();
    await postsModule.fillPostForm(postData);
    await postsModule.publishPost();

    const updatedPostData = {
        title: 'My Edited Post',
        author: 'Test Author The Second',
        imageUrl: 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop',
        content: 'This is a test blog post written by an automated test and edited by another test',
        channelName: 'general',
    };

    // 2. Visit the posts list
    await postsModule.gotoList();

    // 3. Open post by initial title
    await postsModule.openPostByTitle(postData.title);

    // 4. Navigate into edit form
    await postsModule.enterEditMode();

    // 5. Update data & save
    await postsModule.fillPostForm(updatedPostData);
    await postsModule.saveChanges();

    // 6. Open and delete it
    await postsModule.gotoList();
    await postsModule.openPostByTitle(updatedPostData.title);
    await postsModule.deletePost();
    await postsModule.confirmPostDeleted(updatedPostData.title);
  });
});