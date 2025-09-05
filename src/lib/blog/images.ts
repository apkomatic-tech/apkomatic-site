/**
 * Image optimization utilities for blog posts
 */

/**
 * Generate responsive image attributes for blog post images
 * @param src - The image source URL
 * @param alt - The alt text for the image
 * @param width - Optional width for the image
 * @param height - Optional height for the image
 * @returns Object with optimized image attributes
 */
export function generateResponsiveImageAttrs(
	src: string,
	alt: string,
	width?: number,
	height?: number
) {
	// For now, we'll return basic attributes
	// In a production app, you might integrate with an image CDN like Cloudinary
	const attrs: Record<string, string | number> = {
		src,
		alt,
		loading: 'lazy',
		decoding: 'async'
	};

	if (width) attrs.width = width;
	if (height) attrs.height = height;

	return attrs;
}

/**
 * Process image URLs in markdown content to add optimization
 * @param content - The HTML content from processed markdown
 * @returns Optimized HTML content with enhanced image tags
 */
export function optimizeImagesInContent(content: string): string {
	// Replace img tags with optimized versions
	return content.replace(/<img([^>]+)>/g, (match, attributes) => {
		// Extract src and alt from existing attributes
		const srcMatch = attributes.match(/src="([^"]+)"/);
		const altMatch = attributes.match(/alt="([^"]+)"/);

		if (!srcMatch) return match;

		const src = srcMatch[1];
		const alt = altMatch ? altMatch[1] : '';

		// Add optimization attributes
		const optimizedAttrs = generateResponsiveImageAttrs(src, alt);

		// Build the optimized img tag
		const attrString = Object.entries(optimizedAttrs)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ');

		return `<img ${attrString} class="rounded-lg shadow-md max-w-full h-auto">`;
	});
}

/**
 * Generate Open Graph image URL for a blog post
 * @param post - The blog post
 * @returns URL for the Open Graph image
 */
export function generateOGImageUrl(post: { slug: string; title: string }): string {
	// For now, return a default image
	// In production, you might generate dynamic OG images
	return '/images/og-blog-default.jpg';
}

/**
 * Extract the first image from blog post content for use as featured image
 * @param content - The HTML content
 * @returns URL of the first image or null if none found
 */
export function extractFeaturedImage(content: string): string | null {
	const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
	return imgMatch ? imgMatch[1] : null;
}
