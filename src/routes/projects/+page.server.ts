import { sanityClient } from '$lib/sanity/client';
import { makeSafeQueryRunner, q, sanityImage } from 'groqd';

export const load = async () => {
	const runQuery = makeSafeQueryRunner((query) => sanityClient.fetch(query));
	const projects = await runQuery(
		q('*')
			.filter('_type == "project"')
			.grab({
				_id: q.string(),
				name: q.string(),
				slug: q.slug('slug'),
				thumb: sanityImage('thumb'),
				order: q.number()
			})
			.order('order asc')
	);

	return {
		projects
	};
};
