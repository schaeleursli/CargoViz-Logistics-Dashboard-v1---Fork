import { test, expect } from '@playwright/test';
test('login & fetch projects', async ({
  page
}) => {
  await page.goto('/');
  // We should be redirected to login
  await expect(page).toHaveURL(/.*login/);
  // Fill in login form
  await page.getByLabel('Email address').fill('admin@cargoviz.com');
  await page.getByLabel('Password').fill('ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f');
  await page.getByRole('button', {
    name: 'Sign in'
  }).click();
  // After login, we should be on the main page
  await expect(page).toHaveURL('/');
  // Verify that project selector is visible
  await expect(page.getByText('Port of Seattle')).toBeVisible();
  // Check that Space Management module is loaded by default
  await expect(page.getByRole('heading', {
    name: 'Space Management'
  })).toBeVisible();
  // Switch to Cargo Management
  await page.getByRole('button', {
    name: 'Cargo Management'
  }).click();
  await expect(page.getByRole('heading', {
    name: 'Cargo Management'
  })).toBeVisible();
});