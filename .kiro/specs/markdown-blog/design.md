# Design Document

## Overview

The markdown blog feature will be implemented as a native SvelteKit solution that processes markdown files at build time and serves them through dynamic routes. The design leverages SvelteKit's file-based routing, server-side rendering capabilities, and the existing Tailwind CSS + Typography plugin for styling.

## Architecture

### File Structure

```
src/
├── routes/
│   └── blog/
│       ├── +page.server.ts          # Blog listing page server logic
│       ├── +page.svelte             # Blog listing page component
│       └── [slug]/
│           ├── +page.server.ts      # Individual post server logic
│           └── +page.svelte         # Individual post component
├── lib/
│   ├── blog/
│   │   ├── posts.ts                 # Blog post utilities and types
│   │   └── markdown.ts              # Markdown processing utilities
│   └── components/
│       └── blog/
│           ├── PostCard.svelte      # Blog post preview component
│           └── PostContent.svelte   # Blog post content component
└── content/
    └── blog/
        ├── my-first-post.md
        ├── another-post.md
        └── ...
```

### Data Flow

1. **Build Time**: Markdown files are discovered and metadata is extracted
2. **Request Time**: Server functions load and process markdown content
3. **Render Time**: Svelte components render the processed content with styling

## Components and Interfaces

### Blog Post Type

```typescript
interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: Date;
	tags: string[];
	published: boolean;
	content: string;
	readingTime: number;
}

interface BlogPostMetadata {
	title: string;
	description: string;
	date: string;
	tags?: string[];
	published?: boolean;
}
```

### Core Functions

#### `loadBlogPosts(): Promise<BlogPost[]>`

- Scans the `src/content/blog/` directory for markdown files
- Parses frontmatter and content
- Calculates reading time
- Filters out unpublished posts in production
- Returns sorted array of blog posts

#### `loadBlogPost(slug: string): Promise<BlogPost | null>`

- Loads a specific blog post by slug
- Processes markdown content to HTML
- Returns null if post not found or unpublished

#### `processMarkdown(content: string): string`

- Converts markdown to HTML using a markdown processor
- Applies syntax highlighting for code blocks
- Handles image processing and optimization

### Route Components

#### `/blog` - Blog Listing Page

- Server function loads all published blog posts
- Displays posts in a grid/list layout with PostCard components
- Includes pagination if needed (future enhancement)
- SEO optimized with proper meta tags

#### `/blog/[slug]` - Individual Blog Post

- Server function loads specific blog post
- Renders full post content with PostContent component
- Includes navigation to previous/next posts
- SEO optimized with post-specific meta tags

## Data Models

### Frontmatter Schema

```yaml
---
title: 'My Blog Post Title'
description: 'A brief description of the post'
date: '2024-01-15'
tags: ['svelte', 'web-development', 'tutorial']
published: true
---
```

### File Naming Convention

- Markdown files use kebab-case naming: `my-blog-post.md`
- File name (without extension) becomes the URL slug
- Dates can be prefixed: `2024-01-15-my-blog-post.md` (date extracted from frontmatter takes precedence)

## Error Handling

### Missing Posts

- Return 404 status for non-existent blog post slugs
- Graceful fallback for malformed markdown files
- Error logging for debugging during development

### Malformed Frontmatter

- Default values for missing required fields
- Validation of date formats
- Skip posts with critical errors, log warnings

### Build-time Errors

- Clear error messages for invalid markdown files
- Continue build process even if some posts fail
- Development-time warnings for content issues

## Testing Strategy

### Unit Tests

- Test markdown processing functions
- Test frontmatter parsing
- Test blog post loading and filtering
- Test reading time calculation

### Integration Tests

- Test blog listing page loads correctly
- Test individual blog post pages render
- Test 404 handling for missing posts
- Test published/unpublished post filtering

### End-to-End Tests

- Navigate to blog listing page
- Click through to individual posts
- Verify proper styling and layout
- Test responsive design

## Implementation Dependencies

### Required Packages

- `marked` or `markdown-it`: Markdown to HTML conversion
- `gray-matter`: Frontmatter parsing
- `prismjs` or `shiki`: Syntax highlighting
- `reading-time`: Calculate estimated reading time

### Existing Dependencies (Already Available)

- `@tailwindcss/typography`: Prose styling for markdown content
- SvelteKit: File-based routing and SSR
- TypeScript: Type safety
- Tailwind CSS: Styling framework

## Performance Considerations

### Build-time Optimization

- Process markdown files once during build
- Generate static metadata for fast listing pages
- Pre-calculate reading times and excerpts

### Runtime Optimization

- Server-side rendering for SEO and performance
- Lazy loading of blog post content
- Efficient caching strategies for processed content

### SEO Optimization

- Dynamic meta tags for each blog post
- Structured data markup for blog posts
- Sitemap generation including blog posts
- RSS feed generation (future enhancement)
