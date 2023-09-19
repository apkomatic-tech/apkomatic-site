import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

// https://www.sanity.io/docs/image-url
// https://www.sanity.io/docs/image-urls#fit-object-object
export function buildUrlFromImageSource(
	source: SanityImageSource,
	{ width = 1200, height = 600 }: { width?: number; height?: number }
) {
	return builder
		.image(source)
		.auto('format')
		.fit('crop')
		.crop('top')
		.sharpen(15)
		.size(width, height)
		.url();
}
