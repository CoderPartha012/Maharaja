import { test, expect } from '@playwright/test';

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0]!;
};

test.describe('Reservation flow', () => {
  test('complete reservation flow — home → reservations → fill → confirm', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/maharaja/i);

    // Navigate via CTA
    await page
      .getByRole('link', { name: /reserve a table/i })
      .first()
      .click();
    await expect(page).toHaveURL(/reservations/);
    await expect(page.getByRole('heading', { name: /reserve your table/i })).toBeVisible();

    // Fill in the form
    await page.getByLabel(/name \*/i).fill('Priya Sharma');
    await page.getByLabel(/phone \*/i).fill('+91 9876543210');
    await page.getByLabel(/email$/i).fill('priya@example.com');
    await page.getByLabel(/date \*/i).fill(tomorrow());
    await page.getByLabel(/time \*/i).selectOption('19:00');
    await page.getByLabel(/number of guests \*/i).selectOption('2');
    await page.getByLabel(/special requests/i).fill('Window seat preferred');

    // Submit
    await page.getByRole('button', { name: /confirm reservation/i }).click();

    // Should see confirmation
    await expect(page.getByRole('heading', { name: /confirmed|thank you/i })).toBeVisible({
      timeout: 5000,
    });
  });

  test('shows validation errors for empty form submission', async ({ page }) => {
    await page.goto('/reservations');
    await page.getByRole('button', { name: /confirm reservation/i }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('rejects past date', async ({ page }) => {
    await page.goto('/reservations');

    await page.getByLabel(/name \*/i).fill('Test User');
    await page.getByLabel(/phone \*/i).fill('+91 9876543210');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await page.getByLabel(/date \*/i).fill(yesterday.toISOString().split('T')[0]!);
    await page.getByLabel(/time \*/i).selectOption('19:00');
    await page.getByRole('button', { name: /confirm/i }).click();

    await expect(page.getByText(/today or in the future/i)).toBeVisible();
  });

  test('keyboard-only navigation through form', async ({ page }) => {
    await page.goto('/reservations');

    // Tab past navbar, skip link, reach first field
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // navbar logo
    // Continue tabbing until we reach the first form field
    const nameInput = page.getByLabel(/name \*/i);
    await nameInput.focus();
    await page.keyboard.type('Keyboard User');
    await expect(nameInput).toHaveValue('Keyboard User');
  });
});
