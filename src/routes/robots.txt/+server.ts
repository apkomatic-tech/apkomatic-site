/**
 * Dynamic robots.txt generation
 */

import { SITE_URL } from '$lib/config/index.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay (optional, helps with server load)
Crawl-delay: 1`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=86400' // Cache for 24 hours
		}
	});
};
