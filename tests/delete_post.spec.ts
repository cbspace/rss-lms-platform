import { test, expect } from '@playwright/test';
import { PostsModule } from './pages/PostsModule';

test('should allow the user to delete a post and confirm its removal', async ({ page }) => {
  const postsModule = new PostsModule(page);
  const deleteTargetTitle = `Post To Delete - ${Date.now()}`;

  // 1. Create fresh post
  await postsModule.gotoCreate();
  await postsModule.fillPostForm({
    title: deleteTargetTitle,
    author: 'Test Author',
    content: 'Temporary post for deletion testing',
    channelName: 'general',
  });
  await postsModule.publishPost();

  // 2. Open and delete it
  await postsModule.gotoList();
  await postsModule.openPostByTitle(deleteTargetTitle);
  await postsModule.deletePost();

  // 3. Confirm deletion
  await postsModule.confirmPostDeleted(deleteTargetTitle);
});