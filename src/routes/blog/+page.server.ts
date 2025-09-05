import type { PageServerLoad } from './$types';
import { loadBlogPosts } from '$lib/blog/posts.js';
import {
	generateBlogListingMetaTags,
	generateBlogListingStructuredData,
	generateBreadcrumbStructuredData
} from '$lib/blog/seo.js';
import { optimizePostsForSerialization } from '$lib/blog/performance.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const posts = await loadBlogPosts();

		// Generate SEO data
		const metaTags = generateBlogListingMetaTags();
		const structuredData = generateBlogListingStructuredData(posts);
		const breadcrumbData = generateBreadcrumbStructuredData();

		return {
			posts: optimizePostsForSerialization(posts),
			metaTags,
			structuredData,
			breadcrumbData
		};
	} catch (err) {
		console.error('Failed to load blog posts:', err);
		throw error(500, 'Failed to load blog posts');
	}
};
