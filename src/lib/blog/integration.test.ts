/**
 * Integration tests for blog post loading with markdown processing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readdir, readFile } from 'fs/promises';
import { loadBlogPost } from './posts.js';

// Mock the fs/promises module
vi.mock('fs/promises');

const mockReaddir = vi.mocked(readdir);
const mockReadFile = vi.mocked(readFile);

// Mock dev environment as false (production)
vi.mock('$app/environment', () => ({
	dev: false
}));

describe('Blog Post Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should load and process a complete blog post with markdown content', async () => {
		mockReaddir.mockResolvedValue(['complete-post.md'] as any);

		const markdownContent = `---
title: "Complete Blog Post"
description: "A complete blog post with various markdown elements"
date: "2024-01-15"
published: true
tags: ["markdown", "test", "blog"]
---

# Introduction

This is a **complete blog post** with various markdown elements.

## Code Example

Here's some JavaScript code:

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}
\`\`\`

## List Example

- Item 1
- Item 2
- Item 3

## Image Example

![Alt text](https://example.com/image.jpg "Image title")

## Conclusion

This post demonstrates the integration between markdown processing and blog post loading.`;

		mockReadFile.mockResolvedValueOnce(markdownContent);

		const post = await loadBlogPost('complete-post');

		expect(post).not.toBeNull();
		expect(post?.title).toBe('Complete Blog Post');
		expect(post?.description).toBe('A complete blog post with various markdown elements');
		expect(post?.slug).toBe('complete-post');
		expect(post?.tags).toEqual(['markdown', 'test', 'blog']);
		expect(post?.published).toBe(true);
		expect(post?.date).toEqual(new Date('2024-01-15'));

		// Verify that markdown was processed to HTML
		expect(post?.content).toContain('<h1>Introduction</h1>');
		expect(post?.content).toContain('<strong>complete blog post</strong>');
		expect(post?.content).toContain('<pre class="language-javascript">');
		expect(post?.content).toContain('<code class="language-javascript">');
		expect(post?.content).toContain('<ul>');
		expect(post?.content).toContain('<img');

		// Verify reading time was calculated
		expect(post?.readingTime).toBeGreaterThan(0);
	});

	it('should handle blog post with minimal frontmatter', async () => {
		mockReaddir.mockResolvedValue(['minimal-post.md'] as any);

		const markdownContent = `---
title: "Minimal Post"
description: "A minimal blog post"
date: "2024-01-10"
---

This is a minimal blog post with just the required frontmatter fields.

It has some **bold text** and a [link](https://example.com).`;

		mockReadFile.mockResolvedValueOnce(markdownContent);

		const post = await loadBlogPost('minimal-post');

		expect(post).not.toBeNull();
		expect(post?.title).toBe('Minimal Post');
		expect(post?.tags).toEqual([]); // Should default to empty array
		expect(post?.published).toBe(true); // Should default to true
		expect(post?.content).toContain('<strong>bold text</strong>');
		expect(post?.content).toContain('<a href="https://example.com">link</a>');
	});

	it('should calculate reading time accurately', async () => {
		mockReaddir.mockResolvedValue(['long-post.md'] as any);

		// Create a longer post (approximately 200 words for ~1 minute reading time)
		const longContent = Array(50).fill('This is a sentence with about ten words in it.').join(' ');

		const markdownContent = `---
title: "Long Post"
description: "A longer blog post for reading time testing"
date: "2024-01-05"
---

${longContent}`;

		mockReadFile.mockResolvedValueOnce(markdownContent);

		const post = await loadBlogPost('long-post');

		expect(post).not.toBeNull();
		expect(post?.readingTime).toBeGreaterThan(0);
		// Should be approximately 1-2 minutes for ~500 words
		expect(post?.readingTime).toBeLessThan(5);
	});
});
