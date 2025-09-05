/**
 * RSS feed generation for blog posts
 */

import { loadBlogPosts } from '$lib/blog/posts.js';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '$lib/config/index.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const posts = await loadBlogPosts();

		// Take only the latest 20 posts for the RSS feed
		const recentPosts = posts.slice(0, 20);

		// Generate RSS XML
		const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${SITE_NAME} Blog</title>
		<description>${SITE_DESCRIPTION}</description>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
		<language>en-US</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<generator>SvelteKit</generator>
		
		${recentPosts
			.map(
				(post) => `
		<item>
			<title><![CDATA[${post.title}]]></title>
			<description><![CDATA[${post.description}]]></description>
			<link>${SITE_URL}/blog/${post.slug}</link>
			<guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
			<pubDate>${post.date.toUTCString()}</pubDate>
			${post.tags.map((tag) => `<category>${tag}</category>`).join('')}
		</item>`
			)
			.join('')}
	</channel>
</rss>`.trim();

		return new Response(rss, {
			headers: {
				'Content-Type': 'application/rss+xml',
				'Cache-Control': 'max-age=3600' // Cache for 1 hour
			}
		});
	} catch (error) {
		console.error('Error generating RSS feed:', error);
		return new Response('Error generating RSS feed', { status: 500 });
	}
};
