import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test('fills and submits contact form — sees success state', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /contact us/i })).toBeVisible();

    await page.getByLabel(/name \*/i).fill('Rahul Gupta');
    await page.getByLabel(/email \*/i).fill('rahul@example.com');
    await page.getByLabel(/subject \*/i).fill('Table booking enquiry');
    await page
      .getByLabel(/message \*/i)
      .fill('I would like to know more about private dining options.');

    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText(/get back to you soon/i)).toBeVisible();
  });

  test('shows validation errors on empty submission', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('rejects invalid email', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel(/name \*/i).fill('Test');
    await page.getByLabel(/email \*/i).fill('not-valid');
    await page.getByLabel(/subject \*/i).fill('Test subject');
    await page.getByLabel(/message \*/i).fill('Long enough message here.');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('can send another message after first submission', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel(/name \*/i).fill('First User');
    await page.getByLabel(/email \*/i).fill('user@example.com');
    await page.getByLabel(/subject \*/i).fill('Hello');
    await page.getByLabel(/message \*/i).fill('This is my first message.');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible();
    await page.getByRole('button', { name: /send another/i }).click();

    // Form should be back
    await expect(page.getByLabel(/name \*/i)).toBeVisible();
  });
});
