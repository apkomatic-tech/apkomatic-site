import { error } from '@sveltejs/kit';
import { loadBlogPost } from '$lib/blog/posts.js';
import {
	generateBlogPostMetaTags,
	generateBlogPostStructuredData,
	generateBreadcrumbStructuredData
} from '$lib/blog/seo.js';
import { optimizePostsForSerialization } from '$lib/blog/performance.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Load the specific blog post
	const post = await loadBlogPost(slug);

	// Handle 404 cases for non-existent or unpublished posts
	if (!post) {
		throw error(404, {
			message: 'Blog post not found',
			hint: 'The requested blog post does not exist or is not published.'
		});
	}

	// Generate SEO data
	const metaTags = generateBlogPostMetaTags(post, post.rawContent);
	const structuredData = generateBlogPostStructuredData(post, post.rawContent);
	const breadcrumbData = generateBreadcrumbStructuredData(post);

	// Optimize post data for client-side serialization
	const optimizedPost = optimizePostsForSerialization([post])[0];

	return {
		post: optimizedPost,
		metaTags,
		structuredData,
		breadcrumbData
	};
};
