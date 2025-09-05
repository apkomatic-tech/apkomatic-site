/**
 * Unit tests for blog post loading and parsing functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readdir, readFile } from 'fs/promises';
import {
	loadBlogPosts,
	loadBlogPost,
	generateSlug,
	isValidSlug,
	extractSlugFromFilename,
	isValidMetadata,
	type BlogPostMetadata
} from './posts.js';

// Mock the fs/promises module
vi.mock('fs/promises');
vi.mock('./markdown.js', () => ({
	processMarkdown: vi.fn((content: string) => `<p>${content}</p>`)
}));
vi.mock('$app/environment', () => ({
	dev: false
}));

const mockReaddir = vi.mocked(readdir);
const mockReadFile = vi.mocked(readFile);

describe('Blog Post Utilities', () => {
	describe('generateSlug', () => {
		it('should convert text to lowercase slug', () => {
			expect(generateSlug('Hello World')).toBe('hello-world');
		});

		it('should replace spaces with hyphens', () => {
			expect(generateSlug('My Blog Post')).toBe('my-blog-post');
		});

		it('should remove special characters', () => {
			expect(generateSlug('Hello! @World#')).toBe('hello-world');
		});

		it('should handle multiple consecutive spaces', () => {
			expect(generateSlug('Hello    World')).toBe('hello-world');
		});

		it('should remove leading and trailing hyphens', () => {
			expect(generateSlug('-Hello World-')).toBe('hello-world');
		});
	});

	describe('isValidSlug', () => {
		it('should return true for valid slugs', () => {
			expect(isValidSlug('hello-world')).toBe(true);
			expect(isValidSlug('my-blog-post-123')).toBe(true);
			expect(isValidSlug('simple')).toBe(true);
		});

		it('should return false for invalid slugs', () => {
			expect(isValidSlug('')).toBe(false);
			expect(isValidSlug('   ')).toBe(false);
			expect(isValidSlug('-hello')).toBe(false);
			expect(isValidSlug('hello-')).toBe(false);
			expect(isValidSlug('hello--world')).toBe(false);
			expect(isValidSlug('Hello World')).toBe(false);
		});
	});

	describe('extractSlugFromFilename', () => {
		it('should extract slug from simple filename', () => {
			expect(extractSlugFromFilename('my-post.md')).toBe('my-post');
		});

		it('should extract slug from date-prefixed filename', () => {
			expect(extractSlugFromFilename('2024-01-15-my-post.md')).toBe('my-post');
		});

		it('should handle filename without extension', () => {
			expect(extractSlugFromFilename('my-post')).toBe('my-post');
		});

		it('should handle date-prefixed filename without extension', () => {
			expect(extractSlugFromFilename('2024-01-15-my-post')).toBe('my-post');
		});
	});

	describe('isValidMetadata', () => {
		it('should return true for valid metadata', () => {
			const metadata: BlogPostMetadata = {
				title: 'Test Post',
				description: 'A test post',
				date: '2024-01-15'
			};
			expect(isValidMetadata(metadata)).toBe(true);
		});

		it('should return false for missing required fields', () => {
			expect(isValidMetadata({})).toBe(false);
			expect(isValidMetadata({ title: 'Test' })).toBe(false);
			expect(isValidMetadata({ title: 'Test', description: 'Desc' })).toBe(false);
		});

		it('should return true for metadata with optional fields', () => {
			const metadata = {
				title: 'Test Post',
				description: 'A test post',
				date: '2024-01-15',
				tags: ['test'],
				published: true
			};
			expect(isValidMetadata(metadata)).toBe(true);
		});
	});
});

describe('Blog Post Loading', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('loadBlogPosts', () => {
		it('should load and parse all published blog posts', async () => {
			// Mock file system
			mockReaddir.mockResolvedValue(['post1.md', 'post2.md', 'not-markdown.txt'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "First Post"
description: "My first blog post"
date: "2024-01-15"
published: true
tags: ["test", "blog"]
---

This is my first post content.`).mockResolvedValueOnce(`---
title: "Second Post"
description: "My second blog post"
date: "2024-01-10"
published: true
---

This is my second post content.`);

			const posts = await loadBlogPosts();

			expect(posts).toHaveLength(2);
			expect(posts[0].title).toBe('First Post');
			expect(posts[0].slug).toBe('post1');
			expect(posts[0].tags).toEqual(['test', 'blog']);
			expect(posts[1].title).toBe('Second Post');
			expect(posts[1].slug).toBe('post2');

			// Should be sorted by date, newest first
			expect(posts[0].date.getTime()).toBeGreaterThan(posts[1].date.getTime());
		});

		it('should filter out unpublished posts in production', async () => {
			mockReaddir.mockResolvedValue(['published.md', 'unpublished.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Published Post"
description: "A published post"
date: "2024-01-15"
published: true
---

Published content.`).mockResolvedValueOnce(`---
title: "Unpublished Post"
description: "An unpublished post"
date: "2024-01-10"
published: false
---

Unpublished content.`);

			const posts = await loadBlogPosts();

			expect(posts).toHaveLength(1);
			expect(posts[0].title).toBe('Published Post');
		});

		it('should handle posts with default published status', async () => {
			mockReaddir.mockResolvedValue(['default-published.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Default Published"
description: "Post without published field"
date: "2024-01-15"
---

Content without published field.`);

			const posts = await loadBlogPosts();

			expect(posts).toHaveLength(1);
			expect(posts[0].published).toBe(true);
		});

		it('should skip posts with invalid metadata', async () => {
			mockReaddir.mockResolvedValue(['valid.md', 'invalid.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Valid Post"
description: "A valid post"
date: "2024-01-15"
---

Valid content.`).mockResolvedValueOnce(`---
title: "Invalid Post"
# Missing description and date
---

Invalid content.`);

			const posts = await loadBlogPosts();

			expect(posts).toHaveLength(1);
			expect(posts[0].title).toBe('Valid Post');
		});

		it('should handle empty directory', async () => {
			mockReaddir.mockResolvedValue([] as any);

			const posts = await loadBlogPosts();

			expect(posts).toHaveLength(0);
		});

		it('should handle file system errors gracefully', async () => {
			mockReaddir.mockRejectedValue(new Error('Directory not found'));

			const posts = await loadBlogPosts();

			expect(posts).toHaveLength(0);
		});
	});

	describe('loadBlogPost', () => {
		it('should load a specific blog post by slug', async () => {
			mockReaddir.mockResolvedValue(['my-post.md', 'other-post.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "My Post"
description: "My specific post"
date: "2024-01-15"
published: true
---

This is my specific post content.`);

			const post = await loadBlogPost('my-post');

			expect(post).not.toBeNull();
			expect(post?.title).toBe('My Post');
			expect(post?.slug).toBe('my-post');
		});

		it('should handle date-prefixed filenames', async () => {
			mockReaddir.mockResolvedValue(['2024-01-15-my-post.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "My Post"
description: "My specific post"
date: "2024-01-15"
published: true
---

Content.`);

			const post = await loadBlogPost('my-post');

			expect(post).not.toBeNull();
			expect(post?.slug).toBe('my-post');
		});

		it('should return null for non-existent posts', async () => {
			mockReaddir.mockResolvedValue(['other-post.md'] as any);

			const post = await loadBlogPost('non-existent');

			expect(post).toBeNull();
		});

		it('should return null for unpublished posts in production', async () => {
			mockReaddir.mockResolvedValue(['unpublished.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Unpublished Post"
description: "An unpublished post"
date: "2024-01-15"
published: false
---

Unpublished content.`);

			const post = await loadBlogPost('unpublished');

			expect(post).toBeNull();
		});

		it('should handle file reading errors gracefully', async () => {
			mockReaddir.mockResolvedValue(['error-post.md'] as any);
			mockReadFile.mockRejectedValue(new Error('File read error'));

			const post = await loadBlogPost('error-post');

			expect(post).toBeNull();
		});
	});

	describe('Reading Time Calculation', () => {
		it('should calculate reading time for short content', async () => {
			mockReaddir.mockResolvedValue(['short-post.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Short Post"
description: "A very short post"
date: "2024-01-15"
---

Short content.`);

			const post = await loadBlogPost('short-post');

			expect(post).not.toBeNull();
			expect(post?.readingTime).toBeGreaterThanOrEqual(0);
			expect(post?.readingTime).toBeLessThan(1);
		});

		it('should calculate reading time for medium content', async () => {
			mockReaddir.mockResolvedValue(['medium-post.md'] as any);

			// Create content with approximately 200 words (1 minute read)
			const mediumContent = Array(40).fill('This is a sentence with exactly five words.').join(' ');

			mockReadFile.mockResolvedValueOnce(`---
title: "Medium Post"
description: "A medium length post"
date: "2024-01-15"
---

${mediumContent}`);

			const post = await loadBlogPost('medium-post');

			expect(post).not.toBeNull();
			expect(post?.readingTime).toBeGreaterThan(0);
			expect(post?.readingTime).toBeLessThan(3);
		});

		it('should calculate reading time for long content', async () => {
			mockReaddir.mockResolvedValue(['long-post.md'] as any);

			// Create content with approximately 1000 words (5 minute read)
			const longContent = Array(200).fill('This is a sentence with exactly five words.').join(' ');

			mockReadFile.mockResolvedValueOnce(`---
title: "Long Post"
description: "A very long post"
date: "2024-01-15"
---

${longContent}`);

			const post = await loadBlogPost('long-post');

			expect(post).not.toBeNull();
			expect(post?.readingTime).toBeGreaterThan(3);
			expect(post?.readingTime).toBeLessThan(10);
		});

		it('should handle content with code blocks in reading time calculation', async () => {
			mockReaddir.mockResolvedValue(['code-post.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Code Post"
description: "A post with code blocks"
date: "2024-01-15"
---

This post contains code blocks which should be counted in reading time.

\`\`\`javascript
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
}
\`\`\`

More content after the code block with additional text to increase word count.`);

			const post = await loadBlogPost('code-post');

			expect(post).not.toBeNull();
			expect(post?.readingTime).toBeGreaterThan(0);
		});
	});

	describe('Frontmatter Parsing Edge Cases', () => {
		it('should handle frontmatter with extra fields', async () => {
			mockReaddir.mockResolvedValue(['extra-fields.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Post with Extra Fields"
description: "A post with additional frontmatter"
date: "2024-01-15"
author: "John Doe"
category: "Technology"
featured: true
customField: "custom value"
---

Content here.`);

			const post = await loadBlogPost('extra-fields');

			expect(post).not.toBeNull();
			expect(post?.title).toBe('Post with Extra Fields');
			expect(post?.description).toBe('A post with additional frontmatter');
		});

		it('should handle frontmatter with different date formats', async () => {
			mockReaddir.mockResolvedValue(['date-formats.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Date Format Test"
description: "Testing different date formats"
date: "2024-01-15T10:30:00Z"
---

Content here.`);

			const post = await loadBlogPost('date-formats');

			expect(post).not.toBeNull();
			expect(post?.date).toEqual(new Date('2024-01-15T10:30:00Z'));
		});

		it('should handle frontmatter with boolean values', async () => {
			mockReaddir.mockResolvedValue(['boolean-test.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Boolean Test"
description: "Testing boolean values"
date: "2024-01-15"
published: false
featured: true
---

Content here.`);

			const post = await loadBlogPost('boolean-test');

			expect(post).toBeNull(); // Should be null because published: false in production
		});

		it('should handle frontmatter with array values', async () => {
			mockReaddir.mockResolvedValue(['array-test.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Array Test"
description: "Testing array values"
date: "2024-01-15"
tags: 
  - javascript
  - typescript
  - web-development
categories:
  - Programming
  - Tutorial
---

Content here.`);

			const post = await loadBlogPost('array-test');

			expect(post).not.toBeNull();
			expect(post?.tags).toEqual(['javascript', 'typescript', 'web-development']);
		});

		it('should handle malformed YAML frontmatter', async () => {
			mockReaddir.mockResolvedValue(['malformed-yaml.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
title: "Malformed YAML"
description: "Testing malformed YAML"
date: "2024-01-15"
tags: [unclosed array
published: true
---

Content here.`);

			const post = await loadBlogPost('malformed-yaml');

			// Should handle gracefully and return null due to parsing error
			expect(post).toBeNull();
		});

		it('should handle missing frontmatter delimiter', async () => {
			mockReaddir.mockResolvedValue(['no-frontmatter.md'] as any);

			mockReadFile.mockResolvedValueOnce(`# Just a Markdown File

This file has no frontmatter at all.

It should be handled gracefully.`);

			const post = await loadBlogPost('no-frontmatter');

			// Should return null because required frontmatter is missing
			expect(post).toBeNull();
		});

		it('should handle empty frontmatter', async () => {
			mockReaddir.mockResolvedValue(['empty-frontmatter.md'] as any);

			mockReadFile.mockResolvedValueOnce(`---
---

Content with empty frontmatter.`);

			const post = await loadBlogPost('empty-frontmatter');

			// Should return null because required fields are missing
			expect(post).toBeNull();
		});
	});

	describe('Content Processing Integration', () => {
		it('should process markdown content with various elements', async () => {
			mockReaddir.mockResolvedValue(['complex-content.md'] as any);

			const complexContent = `# Main Heading

This post contains **bold text**, *italic text*, and \`inline code\`.

## Code Block

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`

## List

1. First item
2. Second item
3. Third item

## Image

![Test image](test.jpg "Test title")

## Link

[Visit example](https://example.com)

## Blockquote

> This is a blockquote with **bold** text.`;

			mockReadFile.mockResolvedValueOnce(`---
title: "Complex Content"
description: "A post with complex markdown"
date: "2024-01-15"
tags: ["markdown", "test"]
---

${complexContent}`);

			const post = await loadBlogPost('complex-content');

			expect(post).not.toBeNull();
			expect(post?.title).toBe('Complex Content');
			expect(post?.description).toBe('A post with complex markdown');
			expect(post?.tags).toEqual(['markdown', 'test']);
			expect(post?.date).toEqual(new Date('2024-01-15'));
			// The content is processed by the mocked processMarkdown function
			// which just wraps content in <p> tags, so we test for that
			expect(post?.content).toContain('<p>');
			expect(post?.content).toContain('Main Heading');
			expect(post?.content).toContain('bold text');
			expect(post?.content).toContain('italic text');
			expect(post?.content).toContain('inline code');
			expect(post?.readingTime).toBeGreaterThan(0);
		});
	});
});
