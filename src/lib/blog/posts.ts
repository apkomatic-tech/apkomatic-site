/**
 * Core blog post types and interfaces for the markdown blog system
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { processMarkdown } from './markdown.js';
import { measureAsync, blogMetrics } from './performance.js';
import { dev } from '$app/environment';

/**
 * Metadata extracted from frontmatter of markdown files
 */
export interface BlogPostMetadata {
	title: string;
	description: string;
	date: string;
	tags?: string[];
	published?: boolean;
}

/**
 * Complete blog post object with processed content
 */
export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: Date;
	tags: string[];
	published: boolean;
	content: string;
	readingTime: number;
	rawContent?: string; // Raw markdown content for SEO purposes
}

/**
 * Cache entry for blog posts with metadata
 */
interface CacheEntry {
	posts: BlogPost[];
	lastModified: number;
	expires: number;
}

/**
 * Cache for blog posts to improve performance
 */
class BlogPostCache {
	private cache: Map<string, CacheEntry> = new Map();
	private readonly CACHE_TTL = dev ? 1000 : 300000; // 1s in dev, 5min in prod

	async get(key: string, contentPath: string): Promise<BlogPost[] | null> {
		const entry = this.cache.get(key);

		if (!entry) {
			blogMetrics.incrementCounter('cache_misses');
			return null;
		}

		// Check if cache is expired
		if (Date.now() > entry.expires) {
			this.cache.delete(key);
			blogMetrics.incrementCounter('cache_misses');
			return null;
		}

		// In development, check if files have been modified
		if (dev) {
			try {
				const stats = await stat(contentPath);
				if (stats.mtimeMs > entry.lastModified) {
					this.cache.delete(key);
					blogMetrics.incrementCounter('cache_misses');
					return null;
				}
			} catch {
				// If we can't stat the directory, invalidate cache
				this.cache.delete(key);
				blogMetrics.incrementCounter('cache_misses');
				return null;
			}
		}

		blogMetrics.incrementCounter('cache_hits');
		return entry.posts;
	}

	async set(key: string, posts: BlogPost[], contentPath: string): Promise<void> {
		let lastModified = Date.now();

		// In development, use actual directory modification time
		if (dev) {
			try {
				const stats = await stat(contentPath);
				lastModified = stats.mtimeMs;
			} catch {
				// Fallback to current time if stat fails
			}
		}

		this.cache.set(key, {
			posts: [...posts], // Create a copy to avoid mutations
			lastModified,
			expires: Date.now() + this.CACHE_TTL
		});
	}

	clear(): void {
		this.cache.clear();
	}
}

// Global cache instance
const blogCache = new BlogPostCache();

/**
 * Generate a URL-safe slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug string
 */
export function generateSlug(text: string): string {
	return (
		text
			.toLowerCase()
			.trim()
			// Replace spaces and underscores with hyphens
			.replace(/[\s_]+/g, '-')
			// Remove special characters except hyphens
			.replace(/[^\w\-]+/g, '')
			// Remove multiple consecutive hyphens
			.replace(/\-\-+/g, '-')
			// Remove leading and trailing hyphens
			.replace(/^-+|-+$/g, '')
	);
}

/**
 * Validate if a slug is properly formatted
 * @param slug - The slug to validate
 * @returns True if the slug is valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
	// Check if slug is empty or only whitespace
	if (!slug || slug.trim().length === 0) {
		return false;
	}

	// Check if slug matches the expected format
	// Should only contain lowercase letters, numbers, and hyphens
	// Should not start or end with hyphens
	// Should not contain consecutive hyphens
	const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	return slugRegex.test(slug);
}

/**
 * Extract slug from filename
 * @param filename - The markdown filename (with or without extension)
 * @returns The extracted slug
 */
export function extractSlugFromFilename(filename: string): string {
	// Remove .md extension if present
	const nameWithoutExt = filename.replace(/\.md$/, '');

	// Handle date-prefixed filenames (e.g., "2024-01-15-my-post.md")
	const datePrefixRegex = /^\d{4}-\d{2}-\d{2}-(.+)$/;
	const match = nameWithoutExt.match(datePrefixRegex);

	if (match) {
		return match[1]; // Return the part after the date prefix
	}

	return nameWithoutExt;
}

/**
 * Validate blog post metadata
 * @param metadata - The metadata to validate
 * @returns True if metadata is valid, false otherwise
 */
export function isValidMetadata(metadata: Partial<BlogPostMetadata>): metadata is BlogPostMetadata {
	return !!(
		metadata.title &&
		metadata.description &&
		metadata.date &&
		typeof metadata.title === 'string' &&
		typeof metadata.description === 'string' &&
		typeof metadata.date === 'string'
	);
}

/**
 * Get the blog content directory path
 * @returns The absolute path to the blog content directory
 */
function getBlogContentPath(): string {
	return join(process.cwd(), 'src', 'content', 'blog');
}

/**
 * Parse a single markdown file and return a BlogPost object
 * @param filename - The markdown filename
 * @param filePath - The full path to the markdown file
 * @returns A BlogPost object or null if parsing fails
 */
async function parseMarkdownFile(filename: string, filePath: string): Promise<BlogPost | null> {
	try {
		const fileContent = await readFile(filePath, 'utf-8');
		const { data: frontmatter, content } = matter(fileContent);

		// Validate required frontmatter fields
		if (!isValidMetadata(frontmatter)) {
			console.warn(`Invalid metadata in ${filename}: missing required fields`);
			return null;
		}

		// Extract slug from filename
		const slug = extractSlugFromFilename(filename);
		if (!isValidSlug(slug)) {
			console.warn(`Invalid slug generated from filename ${filename}: ${slug}`);
			return null;
		}

		// Parse date
		const date = new Date(frontmatter.date);
		if (isNaN(date.getTime())) {
			console.warn(`Invalid date in ${filename}: ${frontmatter.date}`);
			return null;
		}

		// Process markdown content to HTML
		const processedContent = processMarkdown(content);

		// Calculate reading time
		const readingTimeResult = readingTime(content);

		// Create BlogPost object
		const blogPost: BlogPost = {
			slug,
			title: frontmatter.title,
			description: frontmatter.description,
			date,
			tags: frontmatter.tags || [],
			published: frontmatter.published !== false, // Default to true if not specified
			content: processedContent,
			readingTime: readingTimeResult.minutes,
			rawContent: content // Store raw content for SEO purposes
		};

		return blogPost;
	} catch (error) {
		console.error(`Error parsing markdown file ${filename}:`, error);
		return null;
	}
}

/**
 * Load and parse all blog posts from the content directory
 * @returns Array of BlogPost objects, sorted by date (newest first)
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
	return measureAsync('Load all blog posts', async () => {
		try {
			const contentPath = getBlogContentPath();

			// Check cache first
			const cacheKey = 'all-posts';
			const cachedPosts = await blogCache.get(cacheKey, contentPath);
			if (cachedPosts) {
				blogMetrics.incrementCounter('posts_loaded');
				return cachedPosts;
			}

			const files = await readdir(contentPath);

			// Filter for markdown files
			const markdownFiles = files.filter((file) => file.endsWith('.md'));

			// Parse all markdown files
			const blogPosts: BlogPost[] = [];

			for (const filename of markdownFiles) {
				const filePath = join(contentPath, filename);
				const blogPost = await measureAsync(`Parse ${filename}`, async () =>
					parseMarkdownFile(filename, filePath)
				);

				if (blogPost) {
					// Filter unpublished posts in production
					if (dev || blogPost.published) {
						blogPosts.push(blogPost);
					}
				}
			}

			// Sort by date, newest first
			blogPosts.sort((a, b) => b.date.getTime() - a.date.getTime());

			// Cache the results
			await blogCache.set(cacheKey, blogPosts, contentPath);

			blogMetrics.incrementCounter('posts_loaded');
			blogMetrics.recordTiming('blog_load_time', performance.now());

			// Log performance summary in development
			if (dev) {
				blogMetrics.logSummary();
			}

			return blogPosts;
		} catch (error) {
			console.error('Error loading blog posts:', error);
			return [];
		}
	});
}

/**
 * Load a specific blog post by slug
 * @param slug - The blog post slug
 * @returns BlogPost object or null if not found
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
	try {
		const contentPath = getBlogContentPath();
		const files = await readdir(contentPath);

		// Find the markdown file that matches the slug
		const markdownFiles = files.filter((file) => file.endsWith('.md'));

		for (const filename of markdownFiles) {
			const fileSlug = extractSlugFromFilename(filename);

			if (fileSlug === slug) {
				const filePath = join(contentPath, filename);
				const blogPost = await parseMarkdownFile(filename, filePath);

				if (blogPost) {
					// Return null for unpublished posts in production
					if (!dev && !blogPost.published) {
						return null;
					}
					return blogPost;
				}
			}
		}

		return null;
	} catch (error) {
		console.error(`Error loading blog post with slug ${slug}:`, error);
		return null;
	}
}
