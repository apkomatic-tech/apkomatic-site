import { sanityClient } from '$lib/sanity/client';
import { makeSafeQueryRunner, q, sanityImage } from 'groqd';
import { FORMSPREE_URL } from '$env/static/private';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { MESSAGE_CHAR_LIMIT } from '$lib/config';
import { error } from '@sveltejs/kit';

const schema = z.object({
	contactName: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
	contactEmail: z
		.string({ required_error: 'Email is required' })
		.min(1, 'Email is required')
		.email('Please enter a valid email'),
	contactMessage: z
		.string({ required_error: 'Message is required' })
		.min(1, 'Message is required')
		.max(MESSAGE_CHAR_LIMIT, `Message cannot exceed ${MESSAGE_CHAR_LIMIT} characters`)
});

export async function load() {
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
			.slice(0, 2)
	);
	const testimonials = await runQuery(
		q('*').filter('_type == "testimonial"').grab({
			_id: q.string(),
			author: q.string(),
			company: q.string(),
			content: q.string()
		})
	);
	const contactForm = await superValidate(schema);

	return {
		projects,
		testimonials,
		contactForm
	};
}

export const actions = {
	contact: async ({ request, fetch }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return {
				form
			};
		}

		// send contact information via FormSpree
		if (FORMSPREE_URL) {
			const contactRequest = await fetch(FORMSPREE_URL, {
				method: 'POST',
				body: JSON.stringify(form.data),
				headers: {
					Accept: 'application/json'
				}
			});

			if (contactRequest.ok) {
				return {
					form
				};
			} else {
				throw error(401, {
					message: 'We are unable to process your request. Please try again later.'
				});
			}
		}
	}
};
