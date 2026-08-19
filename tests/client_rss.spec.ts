import { test, expect } from '@playwright/test';
import { PostsModule } from './pages/PostsModule';

test.describe('Client Use Case: RSS Feed Consumption', () => {
  test('should retrieve XML feed and contain published post item', async ({ request, page }) => {
    const postsModule = new PostsModule(page);

    const postData = {
      title: 'My RSS Client Test Post',
      author: 'Test Author',
      imageUrl: 'https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1374&auto=format&fit=crop',
      content: 'This is a test blog post written by an automated test',
      channelName: 'general',
    };

    // 1. Visit the Create Post page and create post
    await postsModule.gotoCreate();
    await postsModule.fillPostForm(postData);
    await postsModule.publishPost();

    // 2. Fetch raw RSS feed as an external client
    const response = await request.get(`/api/rss/${postData.channelName}`);
    expect(response.status()).toBe(200);

    // 3. Validate content type header
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toMatch(/xml/);

    // 4. Parse and assert feed structure
    const xml = await response.text();

    // Standard RSS 2.0 channel checks
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');

    // 5. Assert specific post item contents inside the XML
    expect(xml).toContain('<item>');
    expect(xml).toContain(`<title><![CDATA[${postData.title}]]></title>`);
    expect(xml).toContain(postData.content);
    expect(xml).toContain(postData.author);

    // 6. Open and delete it
    await postsModule.gotoList();
    await postsModule.openPostByTitle(postData.title);
    await postsModule.deletePost();
    await postsModule.confirmPostDeleted(postData.title);

  });
});