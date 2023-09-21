import { sanityClient } from '$lib/sanity/client';
import { error } from '@sveltejs/kit';
import { makeSafeQueryRunner, q, sanityImage } from 'groqd';

export const load = async ({ params }) => {
	const { slug } = params;

	const runQuery = makeSafeQueryRunner((query) => sanityClient.fetch(query));
	const data = await runQuery(
		q('*')
			.filter('_type == "project"')
			.filter(`slug.current == "${slug}"`)
			.grab({
				_id: q.string(),
				name: q.string(),
				url: q.string(),
				description: q.string(),
				thumb: sanityImage('thumb')
			})
	);

	const [project] = data;

	if (!project) {
		throw error(404, {
			message: `Project "${slug.replaceAll('-', ' ')}" was not found`
		});
	}

	return {
		project
	};
};
