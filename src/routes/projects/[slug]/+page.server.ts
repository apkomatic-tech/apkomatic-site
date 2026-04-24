import { sanityClient } from '$lib/sanity/client';
import { error } from '@sveltejs/kit';
import { makeSafeQueryRunner, q, sanityImage } from 'groqd';

function isValidSlug(slug: string): boolean {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function getSafeProjectUrl(url: string): string | null {
	try {
		const parsedUrl = new URL(url);

		if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
			return parsedUrl.href;
		}
	} catch {
		return null;
	}

	return null;
}

export const load = async ({ params }) => {
	const { slug } = params;

	// extract slug from url and validate it to prevent malicious queries
	if (!isValidSlug(slug)) {
		error(404, {
			message: 'Project was not found'
		});
	}

	const runQuery = makeSafeQueryRunner((query: string, queryParams: { slug: string }) =>
		sanityClient.fetch(query, queryParams)
	);
	const data = await runQuery(
		q('*')
			.filter('_type == "project"')
			.filter('slug.current == $slug')
			.grab({
				_id: q.string(),
				name: q.string(),
				url: q.string(),
				description: q.string(),
				thumb: sanityImage('thumb')
			}),
		{ slug }
	);

	const [project] = data;

	if (!project) {
		error(404, {
			message: `Project "${slug.replaceAll('-', ' ')}" was not found`
		});
	}

	return {
		project: {
			...project,
			url: getSafeProjectUrl(project.url)
		}
	};
};
