import { test, expect } from '@playwright/test';

test.describe('Talk Submission Flow', () => {
  test('should allow submitting a talk proposal and verify it appears in the talks list', async ({ page }) => {
    // Generate unique test data to avoid conflicts when running in parallel
    const timestamp = Date.now();
    const talkTitle = `Building Scalable React Applications with TypeScript ${timestamp}`;
    const speakerName = `John Smith ${timestamp}`;
    const speakerEmail = `john.smith.${timestamp}@example.com`;
    const companyName = `TechCorp Solutions ${timestamp}`;
    
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    
    // Verify the page loads correctly
    await expect(page).toHaveTitle('DevBCN 2025 - Developer Conference');
    await expect(page.getByRole('heading', { name: 'DevBCN 2025' }).first()).toBeVisible();
    
    // Click on the "Submit Your Talk" button
    await page.getByRole('link', { name: 'Submit Your Talk' }).click();
    
    // Verify we're on the submit page
    await expect(page).toHaveURL('http://localhost:3000/submit');
    await expect(page.getByRole('heading', { name: 'Submit Your Talk' })).toBeVisible();
    
    // Fill out the talk information form
    await page.getByRole('textbox', { name: 'Talk Title *' }).fill(talkTitle);
    await page.getByRole('textbox', { name: 'Description *' }).fill('This talk will cover best practices for building scalable React applications using TypeScript. We\'ll explore patterns for component architecture, state management, and type safety that help teams deliver maintainable code at scale.');
    await page.getByRole('textbox', { name: 'Tags' }).fill('React, TypeScript, JavaScript, Frontend, Architecture');
    
    // Note: Talk Type (Talk), Duration (30 minutes), and Level (Intermediate) are already selected by default
    
    // Fill out the speaker information
    await page.getByRole('textbox', { name: 'Full Name *' }).fill(speakerName);
    await page.getByRole('textbox', { name: 'Email *' }).fill(speakerEmail);
    await page.getByRole('textbox', { name: 'Company/Organization' }).fill(companyName);
    await page.getByRole('textbox', { name: 'Bio' }).fill('Senior Frontend Developer with 8+ years of experience building scalable web applications. Passionate about React, TypeScript, and developer experience. Speaker at various tech conferences and meetups.');
    
    // Submit the form
    await page.getByRole('button', { name: 'Submit Talk Proposal' }).click();
    
    // Verify success message appears
    await expect(page.getByText('🎉 Thank you! Your talk proposal has been submitted successfully. We\'ll review it and get back to you soon.')).toBeVisible();
    
    // Navigate to the talks page
    await page.getByRole('link', { name: 'Talks' }).click();
    
    // Verify we're on the talks page
    await expect(page).toHaveURL('http://localhost:3000/talks');
    await expect(page.getByRole('heading', { name: 'Conference Talks' })).toBeVisible();
    
    // Verify the submitted talk appears in the talks list
    await expect(page.getByRole('heading', { name: talkTitle })).toBeVisible();
    
    // Verify talk details are displayed correctly
    await expect(page.getByText('This talk will cover best practices for building scalable React applications using TypeScript. We\'ll explore patterns for component architecture, state management, and type safety that help teams deliver maintainable code at scale.').first()).toBeVisible();
    await expect(page.getByText(speakerName)).toBeVisible();
    await expect(page.getByText(companyName)).toBeVisible();
    
    // Verify talk metadata by checking for specific elements within the same talk card
    const talkCard = page.locator('.bg-white').filter({ hasText: talkTitle });
    await expect(talkCard.locator('span:has-text("talk")').first()).toBeVisible();
    await expect(talkCard.locator('span:has-text("intermediate")').first()).toBeVisible();
    await expect(talkCard.locator('span:has-text("30 min")').first()).toBeVisible();
    
    // Verify tags are displayed within the same talk card
    await expect(talkCard.locator('span:has-text("React")').first()).toBeVisible();
    await expect(talkCard.locator('span:has-text("TypeScript")').first()).toBeVisible();
    await expect(talkCard.locator('span:has-text("JavaScript")').first()).toBeVisible();
    await expect(talkCard.locator('span:has-text("Frontend")').first()).toBeVisible();
    await expect(talkCard.locator('span:has-text("Architecture")').first()).toBeVisible();
    
    // Verify submission date is displayed within the same talk card
    await expect(talkCard.getByText(/Submitted \d{1,2}\/\d{1,2}\/\d{4}/)).toBeVisible();
  });
});