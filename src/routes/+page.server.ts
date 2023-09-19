import { sanityClient } from '$lib/sanity/client';
import { makeSafeQueryRunner, q, sanityImage } from 'groqd';

export async function load() {
	const runQuery = makeSafeQueryRunner((query) => sanityClient.fetch(query));
	const projects = await runQuery(
		q('*')
			.filter('_type == "project"')
			.grab({
				_id: q.string(),
				name: q.string(),
				description: q.string(),
				slug: q.slug('slug'),
				thumb: sanityImage('thumb'),
				order: q.number()
			})
	);
	const testimonials = await runQuery(
		q('*').filter('_type == "testimonial"').grab({
			_id: q.string(),
			author: q.string(),
			company: q.string(),
			content: q.string()
		})
	);

	return {
		projects,
		testimonials
	};
}
