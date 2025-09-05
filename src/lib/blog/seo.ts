/**
 * SEO utilities for blog posts including structured data generation
 */

import type { BlogPost } from './posts.js';
import { extractImages } from './markdown.js';
import { SITE_URL, SITE_NAME, COMPANY_NAME } from '$lib/config/index.js';

/**
 * Generate JSON-LD structured data for a blog post
 * @param post - The blog post to generate structured data for
 * @param rawContent - The raw markdown content to extract images from
 * @returns JSON-LD structured data object
 */
export function generateBlogPostStructuredData(post: BlogPost, rawContent?: string) {
	const structuredData: any = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		author: {
			'@type': 'Organization',
			name: COMPANY_NAME,
			url: SITE_URL
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/images/logo.svg`
			}
		},
		datePublished: post.date.toISOString(),
		dateModified: post.date.toISOString(),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${SITE_URL}/blog/${post.slug}`
		},
		url: `${SITE_URL}/blog/${post.slug}`,
		keywords: post.tags.join(', '),
		wordCount: Math.round(post.readingTime * 200), // Approximate word count
		timeRequired: `PT${Math.ceil(post.readingTime)}M`,
		inLanguage: 'en-US'
	};

	// Add featured image if available
	if (rawContent) {
		const images = extractImages(rawContent);
		if (images.length > 0) {
			const featuredImage = images[0];
			structuredData.image = {
				'@type': 'ImageObject',
				url: featuredImage.src.startsWith('http')
					? featuredImage.src
					: `${SITE_URL}${featuredImage.src}`,
				alt: featuredImage.alt
			};
		}
	}

	return structuredData;
}

/**
 * Generate JSON-LD structured data for the blog listing page
 * @param posts - Array of blog posts
 * @returns JSON-LD structured data object
 */
export function generateBlogListingStructuredData(posts: BlogPost[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: `${SITE_NAME} Blog`,
		description: 'Latest insights on web development, design trends, and technology',
		url: `${SITE_URL}/blog`,
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL
		},
		blogPost: posts.slice(0, 10).map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.description,
			url: `${SITE_URL}/blog/${post.slug}`,
			datePublished: post.date.toISOString(),
			author: {
				'@type': 'Organization',
				name: COMPANY_NAME
			}
		}))
	};
}

/**
 * Generate breadcrumb structured data for blog pages
 * @param post - Optional blog post for individual post pages
 * @returns JSON-LD breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(post?: BlogPost) {
	const breadcrumbs = [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'Home',
			item: SITE_URL
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: 'Blog',
			item: `${SITE_URL}/blog`
		}
	];

	if (post) {
		breadcrumbs.push({
			'@type': 'ListItem',
			position: 3,
			name: post.title,
			item: `${SITE_URL}/blog/${post.slug}`
		});
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs
	};
}

/**
 * Generate meta tags for blog posts
 * @param post - The blog post
 * @param rawContent - The raw markdown content to extract images from
 * @returns Object with meta tag properties
 */
export function generateBlogPostMetaTags(post: BlogPost, rawContent?: string) {
	const url = `${SITE_URL}/blog/${post.slug}`;
	let imageUrl = `${SITE_URL}/images/og-blog-default.jpg`; // Default blog image

	// Try to use the first image from the post as the featured image
	if (rawContent) {
		const images = extractImages(rawContent);
		if (images.length > 0) {
			const featuredImage = images[0];
			imageUrl = featuredImage.src.startsWith('http')
				? featuredImage.src
				: `${SITE_URL}${featuredImage.src}`;
		}
	}

	return {
		title: post.title,
		description: post.description,
		canonical: url,
		openGraph: {
			title: post.title,
			description: post.description,
			type: 'article',
			url,
			image: imageUrl,
			siteName: SITE_NAME,
			article: {
				publishedTime: post.date.toISOString(),
				tags: post.tags,
				author: COMPANY_NAME
			}
		},
		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description: post.description,
			image: imageUrl
		}
	};
}

/**
 * Generate meta tags for blog listing page
 * @returns Object with meta tag properties
 */
export function generateBlogListingMetaTags() {
	const url = `${SITE_URL}/blog`;
	const title = `Blog - ${SITE_NAME}`;
	const description =
		'Explore our blog for the latest insights on web development, design trends, and technology. Stay updated with expert tips and industry knowledge.';
	const imageUrl = `${SITE_URL}/images/og-blog-listing.jpg`;

	return {
		title,
		description,
		canonical: url,
		openGraph: {
			title,
			description,
			type: 'website',
			url,
			image: imageUrl,
			siteName: SITE_NAME
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			image: imageUrl
		}
	};
}
