/**
 * Dynamic sitemap generation for SEO
 */

import { loadBlogPosts } from '$lib/blog/posts.js';
import { SITE_URL } from '$lib/config/index.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const posts = await loadBlogPosts();

		// Generate sitemap XML
		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<!-- Homepage -->
	<url>
		<loc>${SITE_URL}</loc>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
	</url>
	
	<!-- Blog listing page -->
	<url>
		<loc>${SITE_URL}/blog</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
		<lastmod>${posts.length > 0 ? posts[0].date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
	</url>
	
	<!-- Individual blog posts -->
	${posts
		.map(
			(post) => `
	<url>
		<loc>${SITE_URL}/blog/${post.slug}</loc>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
		<lastmod>${post.date.toISOString().split('T')[0]}</lastmod>
	</url>`
		)
		.join('')}
</urlset>`.trim();

		return new Response(sitemap, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=3600' // Cache for 1 hour
			}
		});
	} catch (error) {
		console.error('Error generating sitemap:', error);
		return new Response('Error generating sitemap', { status: 500 });
	}
};
