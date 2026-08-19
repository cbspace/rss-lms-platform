import { type Page, type Locator, expect } from '@playwright/test';

export interface PostFormData {
  title?: string;
  author?: string;
  imageUrl?: string;
  content?: string;
  channelName?: string;
}

export class PostsModule {
  readonly page: Page;
  readonly defaultTimeout: number;
  readonly deletePostButton: Locator;
  readonly confirmDeleteButton: Locator;

  // Form Locators
  readonly titleInput: Locator;
  readonly authorInput: Locator;
  readonly imageUrlInput: Locator;
  readonly contentInput: Locator;

  // Buttons & Action Links
  readonly editPostLink: Locator;
  readonly publishButton: Locator;
  readonly saveAndUpdateButton: Locator;

  constructor(page: Page, defaultTimeout = 15_000) {
    this.page = page;
    this.defaultTimeout = defaultTimeout;

    // Locators
    this.titleInput = page.getByLabel(/post title/i);
    this.authorInput = page.getByLabel(/author/i);
    this.imageUrlInput = page.getByLabel(/image url/i);
    this.contentInput = page.getByLabel(/post content/i);

    this.editPostLink = page.getByRole('link', { name: /edit post/i });
    this.publishButton = page.getByRole('button', { name: /Publish Post & Update RSS Feeds/i });
    this.saveAndUpdateButton = page.locator('button:has-text("Save & Update Post")');
    this.deletePostButton = page.getByRole('button', { name: /delete/i });
    this.confirmDeleteButton = page.getByRole('button', { name: /yes, delete post/i });
  }

  // Navigates to the Create Post page.
  async gotoCreate() {
    await this.page.goto('/posts/create');
    await this.page.waitForLoadState('networkidle');
  }

  // Navigates to the main posts list page.
  async gotoList() {
    await this.page.goto('/posts');
    await this.page.waitForLoadState('networkidle');
  }

  // Fills out the common post form fields.
  async fillPostForm(data: PostFormData) {
    if (data.title !== undefined) {
      await this.titleInput.fill(data.title, { timeout: this.defaultTimeout });
    }
    if (data.author !== undefined) {
      await this.authorInput.fill(data.author, { timeout: this.defaultTimeout });
    }
    if (data.imageUrl !== undefined) {
      await this.imageUrlInput.fill(data.imageUrl, { timeout: this.defaultTimeout });
    }
    if (data.content !== undefined) {
      await this.contentInput.fill(data.content, { timeout: this.defaultTimeout });
    }
    if (data.channelName !== undefined) {
      await this.page
        .getByRole('checkbox', { name: new RegExp(data.channelName, 'i') })
        .check({ timeout: this.defaultTimeout });
    }
  }

  // Submits the create form.
  async publishPost() {
    await this.publishButton.click({ timeout: this.defaultTimeout });
  }

  // Finds a post card by title and clicks its 'View / Edit' link.
  async openPostByTitle(title: string) {
    const blogCard = this.page.locator('article').filter({ hasText: title });
    await expect(blogCard).toBeVisible({ timeout: this.defaultTimeout });
    await blogCard.getByRole('link', { name: /edit/i }).click();

    await expect(this.page).toHaveURL(/\/posts\/post-\d+\/?$/);
    await this.page.waitForLoadState('networkidle');
  }

  // Confirms that all post attributes are rendered correctly on the post view page.
  async confirmPostDetails(data: PostFormData) {
    const options = { timeout: this.defaultTimeout };

    // 1. Post Title (<h1> inside the article header)
    if (data.title) {
      await expect(
        this.page.getByRole('heading', { level: 1, name: data.title })
      ).toBeVisible(options);
    }

    // 2. Author ("✍️ By Test Author" inside the author container)
    if (data.author) {
      await expect(
        this.page.locator('header').getByText(data.author, { exact: false })
      ).toBeVisible(options);
    }

    // 3. Body Content (div with whitespace-pre-line)
    if (data.content) {
      await expect(
        this.page.locator('section').getByText(data.content)
      ).toBeVisible(options);
    }

    // 4. Image (<img alt="My First Post" src="...">)
    if (data.imageUrl) {
      await expect(
        this.page.locator(`img[src="${data.imageUrl}"]`)
      ).toBeVisible(options);
    }

    // 5. Published Channel Badge (<a href="/api/rss/general">)
    if (data.channelName) {
      await expect(
        this.page.locator(`a[href="/api/rss/${data.channelName}"]`)
      ).toBeVisible(options);
    }
  }

  // Enters the dedicated edit form from the post view page.
  async enterEditMode() {
    await this.editPostLink.click({ timeout: this.defaultTimeout });

    await expect(this.page).toHaveURL(/\/posts\/post-\d+\/edit\/?$/);
    await this.page.waitForLoadState('networkidle');
  }

  // Submits the edit form.
  async saveChanges() {
    await this.saveAndUpdateButton.click({ timeout: this.defaultTimeout });
  }

  // Delete a post
  async deletePost() {
    // 1. Click the primary delete button
    await this.deletePostButton.click({ timeout: this.defaultTimeout });

    // 2. Wait for confirmation modal and click "Yes, Delete Post"
    await expect(this.confirmDeleteButton).toBeVisible({ timeout: this.defaultTimeout });
    await this.confirmDeleteButton.click({ timeout: this.defaultTimeout });

    // 3. Confirm redirection back to the posts list
    await expect(this.page).toHaveURL(/\/posts\/?$/, { timeout: this.defaultTimeout });
    await this.page.waitForLoadState('networkidle');
  }

  // Asserts that a post with the specified title is no longer present on the list page.
  async confirmPostDeleted(title: string) {
    const postItem = this.page.locator('article').filter({ hasText: title });
    await expect(postItem).toHaveCount(0, { timeout: this.defaultTimeout });
  }
}