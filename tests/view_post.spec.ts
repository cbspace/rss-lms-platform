import { test, expect } from '@playwright/test';
import { PostsModule } from './pages/PostsModule';

// Test Post Viewing
test.describe('View a post', () => {
  test('should allow the user to click on a post and view its contents', async ({ page }) => {
    const postsModule = new PostsModule(page);

    // Details of a post to create
    const postData = {
      title: 'My View Test Post',
      author: 'Test Author',
      imageUrl: 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop',
      content: 'This is a test blog post written by an automated test',
      channelName: 'general',
    };

    // 1. Create Initial Post
    await postsModule.gotoCreate();
    await postsModule.fillPostForm(postData);
    await postsModule.publishPost();

    // 2. Visit the posts list
    await postsModule.gotoList();

    // 3. Open post by title
    await postsModule.openPostByTitle(postData.title);

    // 4. Confirm correct post details
    await postsModule.confirmPostDetails(postData);

    // 5. Open and delete it
    await postsModule.gotoList();
    await postsModule.openPostByTitle(postData.title);
    await postsModule.deletePost();
    await postsModule.confirmPostDeleted(postData.title);
  });
});