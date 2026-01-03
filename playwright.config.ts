import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs', // 👈 Aquí buscará los tests
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium', // Google Chrome
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox', // Firefox
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile', // Celular
      use: { ...devices['Pixel 5'] },
    },
  ],

  // ⚡ Arranca tu app automáticamente antes de testear
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});