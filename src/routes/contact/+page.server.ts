import { FORMSPREE_URL } from '$env/static/private';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { MESSAGE_CHAR_LIMIT } from '$lib/config';
import { error, redirect } from '@sveltejs/kit';

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

	return {
		form
	};
};

export const actions = {
	default: async ({ request, fetch }) => {
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

			// on successful submission redirect to confirmation page
			if (contactRequest.ok) {
				redirect(303, '/contact/confirmation');
			} else {
				error(401, {
                					message: 'We are unable to process your request. Please try again later.'
                				});
			}
		} else {
			error(500, {
            				message: 'We are unable to process your request. Please try again later.'
            			});
		}
	}
};
