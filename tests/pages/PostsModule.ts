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

  // Form Locators (supporting both placeholder and label/id selectors)
  readonly titleInput: Locator;
  readonly authorInput: Locator;
  readonly imageUrlInput: Locator;
  readonly contentInput: Locator;

  // Buttons & Action Links
  readonly editPostLink: Locator;
  readonly publishButton: Locator;
  readonly saveAndUpdateButton: Locator;

  constructor(page: Page, defaultTimeout = 10_000) {
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
  }

  /**
   * Navigates to the Create Post page.
   */
  async gotoCreate() {
    await this.page.goto('/posts/create');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigates to the main posts list page.
   */
  async gotoList() {
    await this.page.goto('/posts');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fills out the common post form fields.
   */
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

  /**
   * Submits the create form.
   */
  async publishPost() {
    await this.publishButton.click({ timeout: this.defaultTimeout });
  }

  /**
   * Finds a post card by title and clicks its 'View / Edit' link.
   */
  async openPostByTitle(title: string) {
    const blogCard = this.page.locator('article').filter({ hasText: title });
    await expect(blogCard).toBeVisible({ timeout: this.defaultTimeout });
    await blogCard.getByRole('link', { name: /edit/i }).click();

    await expect(this.page).toHaveURL(/\/posts\/post-\d+\/?$/);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Enters the dedicated edit form from the post view page.
   */
  async enterEditMode() {
    await this.editPostLink.click({ timeout: this.defaultTimeout });

    await expect(this.page).toHaveURL(/\/posts\/post-\d+\/edit\/?$/);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Submits the edit form.
   */
  async saveChanges() {
    await this.saveAndUpdateButton.click({ timeout: this.defaultTimeout });
  }
}