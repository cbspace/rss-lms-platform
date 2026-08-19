// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Set your base URL here, currently set in the Makefile
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Optional: capture trace on failure
    trace: 'on-first-retry',
  },
});