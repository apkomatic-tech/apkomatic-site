import { FORMSPREE_URL } from '$env/static/private';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { MESSAGE_CHAR_LIMIT } from '$lib/config';
import { sleep } from '$lib/utilities/sleep';
import { redirect } from '@sveltejs/kit';

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

export const load = async () => {
	const form = await superValidate(schema);
	await sleep(2000);
	return {
		form
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return {
				form
			};
		}

		throw redirect(303, '/contact/confirmation');
	}
};
