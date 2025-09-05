import { expect, test } from '@playwright/test';

test.describe('Blog Integration Tests', () => {
	test.describe('Blog Listing Page', () => {
		test('should load blog listing page with correct posts', async ({ page }) => {
			await page.goto('/blog');

			// Check that the page loads successfully
			await expect(page).toHaveTitle(/blog/i);

			// Check for blog posts - there should be at least the sample posts
			const postCards = page.locator('[data-testid="post-card"]');
			await expect(postCards).toHaveCount(3); // We have 3 published sample posts

			// Check that posts are displayed with proper information
			const firstPost = postCards.first();
			await expect(firstPost.locator('h2')).toBeVisible(); // Post title
			await expect(firstPost.locator('[data-testid="post-date"]')).toBeVisible(); // Post date
			await expect(firstPost.locator('[data-testid="post-description"]')).toBeVisible(); // Post description
		});

		test('should display posts in chronological order (newest first)', async ({ page }) => {
			await page.goto('/blog');

			const postDates = page.locator('[data-testid="post-date"]');
			const dateTexts = await postDates.allTextContents();

			// Convert to dates and verify they're in descending order
			const dates = dateTexts.map((dateText) => new Date(dateText.trim()));
			for (let i = 0; i < dates.length - 1; i++) {
				expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
			}
		});

		test('should navigate to individual post when clicked', async ({ page }) => {
			await page.goto('/blog');

			// Click on the first blog post
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			const href = await firstPostLink.getAttribute('href');

			await firstPostLink.click();

			// Should navigate to the individual post page
			await expect(page).toHaveURL(href!);

			// Should display the full post content
			await expect(page.locator('[data-testid="post-content"]')).toBeVisible();
		});

		test('should display tags for posts that have them', async ({ page }) => {
			await page.goto('/blog');

			// Look for posts with tags
			const postsWithTags = page.locator(
				'[data-testid="post-card"]:has([data-testid="post-tags"])'
			);

			if ((await postsWithTags.count()) > 0) {
				const firstPostWithTags = postsWithTags.first();
				const tags = firstPostWithTags.locator('[data-testid="post-tags"] [data-testid="tag"]');
				await expect(tags.first()).toBeVisible();
			}
		});

		test('should have proper SEO meta tags', async ({ page }) => {
			await page.goto('/blog');

			// Check for proper meta tags - use first() to handle multiple description tags
			await expect(page.locator('meta[name="description"]').first()).toHaveAttribute(
				'content',
				/.+/
			);
			await expect(page).toHaveTitle(/blog/i);
		});
	});

	test.describe('Individual Blog Post Pages', () => {
		test('should render individual blog post properly', async ({ page }) => {
			// First, get a post slug from the blog listing
			await page.goto('/blog');
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			const href = await firstPostLink.getAttribute('href');

			// Navigate to the individual post
			await page.goto(href!);

			// Check that the post content is displayed
			await expect(page.locator('[data-testid="post-content"]')).toBeVisible();
			await expect(page.locator('[data-testid="post-title"]')).toBeVisible();
			await expect(page.locator('[data-testid="post-date"]')).toBeVisible();

			// Check that markdown content is properly rendered
			const content = page.locator('[data-testid="post-content"]');

			// Should contain HTML elements (indicating markdown was processed)
			const hasHeadings = (await content.locator('h1, h2, h3, h4, h5, h6').count()) > 0;
			const hasParagraphs = (await content.locator('p').count()) > 0;

			expect(hasHeadings || hasParagraphs).toBeTruthy();
		});

		test('should display post metadata correctly', async ({ page }) => {
			await page.goto('/blog');
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			const href = await firstPostLink.getAttribute('href');

			await page.goto(href!);

			// Check for post metadata
			await expect(page.locator('[data-testid="post-title"]')).toBeVisible();
			await expect(page.locator('[data-testid="post-date"]')).toBeVisible();

			// Check for tags if they exist
			const tagsContainer = page.locator('[data-testid="post-tags"]');
			if ((await tagsContainer.count()) > 0) {
				await expect(tagsContainer).toBeVisible();
			}
		});

		test('should handle code blocks with syntax highlighting', async ({ page }) => {
			// Navigate to a post that likely has code blocks
			await page.goto('/blog/typescript-best-practices');

			const codeBlocks = page.locator('pre code');

			if ((await codeBlocks.count()) > 0) {
				// Check that code blocks have syntax highlighting classes
				const firstCodeBlock = codeBlocks.first();
				const className = await firstCodeBlock.getAttribute('class');
				expect(className).toMatch(/language-/);
			}
		});

		test('should display images with proper attributes', async ({ page }) => {
			await page.goto('/blog');
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			const href = await firstPostLink.getAttribute('href');

			await page.goto(href!);

			const images = page.locator('[data-testid="post-content"] img');

			if ((await images.count()) > 0) {
				const firstImage = images.first();

				// Check for proper attributes
				await expect(firstImage).toHaveAttribute('alt');
				await expect(firstImage).toHaveAttribute('loading', 'lazy');

				// Check for responsive classes
				const className = await firstImage.getAttribute('class');
				expect(className).toContain('max-w-full');
			}
		});

		test('should have proper SEO meta tags for individual posts', async ({ page }) => {
			await page.goto('/blog');
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			const href = await firstPostLink.getAttribute('href');

			await page.goto(href!);

			// Check for proper meta tags - use first() to handle multiple description tags
			await expect(page.locator('meta[name="description"]').first()).toHaveAttribute(
				'content',
				/.+/
			);

			// Title should contain the post title
			const title = await page.title();
			expect(title.length).toBeGreaterThan(0);
		});
	});

	test.describe('404 Handling', () => {
		test('should handle 404 for non-existent blog posts', async ({ page }) => {
			// Try to access a non-existent blog post
			const response = await page.goto('/blog/non-existent-post-slug-12345');

			// Should return 404 status
			expect(response?.status()).toBe(404);
		});

		test('should handle 404 for malformed blog post URLs', async ({ page }) => {
			// Try various malformed URLs
			const malformedUrls = [
				'/blog/',
				'/blog//',
				'/blog/invalid..slug',
				'/blog/slug-with-spaces and-special-chars!'
			];

			for (const url of malformedUrls) {
				const response = await page.goto(url);
				// Should either 404 or redirect properly
				expect([404, 301, 302]).toContain(response?.status() || 404);
			}
		});
	});

	test.describe('Published/Unpublished Post Filtering', () => {
		test('should not display unpublished posts in production', async ({ page }) => {
			await page.goto('/blog');

			// Check that unpublished posts are not visible
			// We know there's an unpublished post in the sample content
			const postTitles = await page.locator('[data-testid="post-card"] h2').allTextContents();

			// Should not contain the unpublished post title
			expect(postTitles).not.toContain('Upcoming Features Draft');
		});

		test('should return 404 for direct access to unpublished posts', async ({ page }) => {
			// Try to access the unpublished post directly
			const response = await page.goto('/blog/upcoming-features-draft');

			// Should return 404 status
			expect(response?.status()).toBe(404);
		});
	});

	test.describe('Navigation Integration', () => {
		test('should have blog navigation link in header', async ({ page }) => {
			await page.goto('/');

			// Look for blog navigation link
			const blogLink = page.locator('nav a[href="/blog"], header a[href="/blog"]');
			await expect(blogLink).toBeVisible();
		});

		test('should navigate from main site to blog and back', async ({ page }) => {
			// Start from home page
			await page.goto('/');

			// Navigate to blog
			const blogLink = page.locator('nav a[href="/blog"], header a[href="/blog"]').first();
			await blogLink.click();

			// Should be on blog page
			await expect(page).toHaveURL('/blog');

			// Navigate back to home (assuming there's a home/logo link)
			const homeLink = page
				.locator('nav a[href="/"], header a[href="/"], [data-testid="logo"] a')
				.first();
			if ((await homeLink.count()) > 0) {
				await homeLink.click();
				await expect(page).toHaveURL('/');
			}
		});

		test('should maintain site layout and styling on blog pages', async ({ page }) => {
			await page.goto('/blog');

			// Check that header/navigation is present
			const header = page.locator('header, nav');
			await expect(header.first()).toBeVisible();

			// Check that footer is present (if it exists)
			const footer = page.locator('footer');
			if ((await footer.count()) > 0) {
				await expect(footer).toBeVisible();
			}

			// Navigate to individual post and check layout consistency
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			await firstPostLink.click();

			// Header should still be present
			await expect(header.first()).toBeVisible();
		});
	});

	test.describe('Responsive Design', () => {
		test('should display properly on mobile devices', async ({ page }) => {
			// Set mobile viewport
			await page.setViewportSize({ width: 375, height: 667 });

			await page.goto('/blog');

			// Check that content is visible and properly laid out
			await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();

			// Navigate to individual post
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			await firstPostLink.click();

			// Check that post content is readable on mobile
			const postContent = page.locator('[data-testid="post-content"]');
			await expect(postContent).toBeVisible();

			// Check that images are responsive
			const images = page.locator('[data-testid="post-content"] img');
			if ((await images.count()) > 0) {
				const firstImage = images.first();
				const boundingBox = await firstImage.boundingBox();

				if (boundingBox) {
					// Image should not exceed viewport width
					expect(boundingBox.width).toBeLessThanOrEqual(375);
				}
			}
		});

		test('should display properly on tablet devices', async ({ page }) => {
			// Set tablet viewport
			await page.setViewportSize({ width: 768, height: 1024 });

			await page.goto('/blog');

			// Check layout on tablet
			await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();

			// Check that multiple posts can be visible (grid layout)
			const visiblePosts = await page.locator('[data-testid="post-card"]').count();
			expect(visiblePosts).toBeGreaterThan(0);
		});
	});

	test.describe('Performance and Loading', () => {
		test('should load blog listing page within reasonable time', async ({ page }) => {
			const startTime = Date.now();

			await page.goto('/blog');
			await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();

			const loadTime = Date.now() - startTime;

			// Should load within 3 seconds (adjust as needed)
			expect(loadTime).toBeLessThan(3000);
		});

		test('should load individual blog posts within reasonable time', async ({ page }) => {
			await page.goto('/blog');
			const firstPostLink = page.locator('[data-testid="post-card"] a').first();
			const href = await firstPostLink.getAttribute('href');

			const startTime = Date.now();

			await page.goto(href!);
			await expect(page.locator('[data-testid="post-content"]')).toBeVisible();

			const loadTime = Date.now() - startTime;

			// Should load within 3 seconds
			expect(loadTime).toBeLessThan(3000);
		});
	});
});
