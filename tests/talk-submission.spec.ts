import { test, expect } from '@playwright/test';

test.describe('Talk Submission Flow', () => {
  test('should allow user to submit a talk proposal and verify it appears in talks list', async ({ page }) => {
    // Generate unique data for this test run
    const timestamp = Date.now();
    const uniqueTitle = `Building Modern Web Applications with React and TypeScript - ${timestamp}`;
    const uniqueEmail = `john.doe.${timestamp}@example.com`;
    
    // Navigate to the home page
    await page.goto('/');
    
    // Verify the page loaded correctly
    await expect(page).toHaveTitle('DevBCN 2025 - Developer Conference');
    await expect(page.getByRole('heading', { name: 'DevBCN 2025' }).first()).toBeVisible();
    
    // Click on "Submit Talk" navigation link
    await page.getByRole('link', { name: 'Submit Talk' }).click();
    
    // Verify we're on the submit page
    await expect(page).toHaveURL('/submit');
    await expect(page.getByRole('heading', { name: 'Submit Your Talk' })).toBeVisible();
    
    // Fill in the talk information
    await page.getByRole('textbox', { name: 'Talk Title *' }).fill(uniqueTitle);
    await page.getByRole('textbox', { name: 'Description *' }).fill('A comprehensive guide to building scalable and maintainable web applications using React and TypeScript. We\'ll cover best practices, patterns, and tools that will help you write better code and ship faster.');
    
    // Select talk type (already defaults to "talk")
    await expect(page.getByRole('combobox', { name: 'Talk Type *' })).toHaveValue('talk');
    
    // Select duration (already defaults to "30")
    await expect(page.getByRole('combobox', { name: 'Duration (minutes) *' })).toHaveValue('30');
    
    // Select level (already defaults to "intermediate")
    await expect(page.getByRole('combobox', { name: 'Level *' })).toHaveValue('intermediate');
    
    // Fill in tags
    await page.getByRole('textbox', { name: 'Tags' }).fill('React, TypeScript, Web Development, Frontend');
    
    // Fill in speaker information
    await page.getByRole('textbox', { name: 'Full Name *' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email *' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Company/Organization' }).fill('Tech Solutions Inc');
    await page.getByRole('textbox', { name: 'Bio' }).fill('Senior Frontend Developer with 8+ years of experience building scalable web applications. Passionate about React, TypeScript, and modern web technologies.');
    
    // Submit the form
    await page.getByRole('button', { name: 'Submit Talk Proposal' }).click();
    
    // Verify success message appears
    await expect(page.getByText('🎉 Thank you! Your talk proposal has been submitted successfully. We\'ll review it and get back to you soon.')).toBeVisible();
    
    // Navigate to talks page (use the navigation link specifically)
    await page.locator('nav').getByRole('link', { name: 'Talks' }).click();
    
    // Verify we're on the talks page
    await expect(page).toHaveURL('/talks');
    await expect(page.getByRole('heading', { name: 'Conference Talks' })).toBeVisible();
    
    // Verify the submitted talk appears in the talks list
    // Find the talk card that contains our specific unique title
    const talkCard = page.locator('.bg-white.rounded-lg.shadow-sm').filter({ hasText: uniqueTitle });
    await expect(talkCard).toBeVisible();
    
    // Verify the talk details within the card
    await expect(talkCard.getByRole('heading', { level: 3 })).toContainText('Building Modern Web Applications with React and TypeScript');
    await expect(talkCard.getByText('A comprehensive guide to building scalable and maintainable web applications using React and TypeScript. We\'ll cover best practices, patterns, and tools that will help you write better code and ship faster.')).toBeVisible();
    await expect(talkCard.getByText('John Doe')).toBeVisible();
    await expect(talkCard.getByText('Tech Solutions Inc')).toBeVisible();
    
    // Verify the talk details are correct
    await expect(talkCard.getByText('talk')).toBeVisible();
    await expect(talkCard.getByText('intermediate')).toBeVisible();
    await expect(talkCard.getByText('30 min')).toBeVisible();
    
    // Verify tags are displayed (look for span elements containing the tags)
    await expect(talkCard.locator('span', { hasText: 'React' })).toBeVisible();
    await expect(talkCard.locator('span', { hasText: 'TypeScript' })).toBeVisible();
    await expect(talkCard.locator('span', { hasText: 'Web Development' })).toBeVisible();
    await expect(talkCard.locator('span', { hasText: 'Frontend' })).toBeVisible();
  });
  
  test('should display validation errors for required fields', async ({ page }) => {
    // Navigate to the submit page
    await page.goto('/submit');
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Submit Talk Proposal' }).click();
    
    // The form should prevent submission and focus on first invalid field
    // Since the form validation is browser-based, the required fields should be highlighted
    await expect(page.getByRole('textbox', { name: 'Talk Title *' })).toBeFocused();
  });
  
  test('should navigate between pages correctly', async ({ page }) => {
    // Navigate to home
    await page.goto('/');
    
    // Click Submit Talk button from the hero section
    await page.getByRole('link', { name: 'Submit Your Talk' }).click();
    await expect(page).toHaveURL('/submit');
    
    // Navigate back to home using the navigation
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
    
    // Navigate to talks page (use the navigation link specifically)
    await page.locator('nav').getByRole('link', { name: 'Talks' }).click();
    await expect(page).toHaveURL('/talks');
    
    // Navigate back to home using the logo
    await page.getByRole('link', { name: 'DevBCN 2025' }).click();
    await expect(page).toHaveURL('/');
  });
});