<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { COMPANY_NAME, MESSAGE_CHAR_LIMIT } from '$lib/config';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	const { form, enhance, errors, submitting, message } = superForm(data.form, {
		onError({ result }) {
			$message = result.error.message;
		}
	});
</script>

<svelte:head>
	<title>{COMPANY_NAME} - Contact</title>
</svelte:head>

<div class="wrapper-narrow">
	<h1 class="page-title mb-8">Contact Us</h1>
	<p class="mb-10 mt-4 text-slate-700">
		Ready to discuss your next web development project or have questions about our services? We're
		here to help! Please reach out to us using the contact form below or email us directly at <a
			href="mailto:apkomatic@gmail.com?subject={encodeURI('Contact request')}"
			class="link">apkomatic@gmail.com</a
		>. We'll get back to you as soon as possible.
	</p>
	<section class="my-6">
		<form use:enhance name="contact" method="post">
			<div class="relative mb-6">
				<label for="name" class="label"> Name: </label>
				<input
					type="text"
					id="name"
					name="contactName"
					placeholder="Your Name"
					class="input"
					class:error={!!$errors.contactName}
					bind:value={$form.contactName}
					required
				/>
				{#if $errors.contactName?.length}
					<label for="name" class="error-message">
						<Icon icon="mdi:alert" />
						{$errors.contactName[0]}
					</label>
				{/if}
			</div>
			<div class="relative mb-6">
				<label for="email" class="label"> Email: </label>
				<input
					type="email"
					id="email"
					name="contactEmail"
					placeholder="Your Email Address"
					class="input"
					class:error={!!$errors.contactEmail}
					bind:value={$form.contactEmail}
					required
				/>
				{#if $errors.contactEmail?.length}
					<label for="email" class="error-message">
						<Icon icon="mdi:alert" />
						{$errors.contactEmail[0]}
					</label>
				{/if}
			</div>
			<div class="relative mb-9">
				<label for="email" class="label">
					<span class="gap-5">
						Message: <span class="text-xs font-normal text-slate-600">
							Maximum message length is {MESSAGE_CHAR_LIMIT} characters
						</span>
					</span></label
				>
				<textarea
					id="message"
					name="contactMessage"
					placeholder={`Your message (${MESSAGE_CHAR_LIMIT} characters max)`}
					rows={5}
					class="input"
					class:error={!!$errors.contactMessage}
					required
					maxlength={MESSAGE_CHAR_LIMIT}
					bind:value={$form.contactMessage}
				></textarea>
				{#if $errors.contactMessage?.length}
					<label for="message" class="error-message">
						<Icon icon="mdi:alert" />
						{$errors.contactMessage[0]}
					</label>
				{/if}
			</div>
			{#if $message}
				<div class="my-2 flex items-center gap-2 bg-red-100 p-2 text-red-700">
					<Icon icon="mdi:alert" />
					{$message}
				</div>
			{/if}
			<button
				type="submit"
				disabled={$submitting}
				class="button button--primary block px-16 disabled:opacity-50"
			>
				{$submitting ? 'Sending...' : 'Send'}
			</button>
		</form>
	</section>
</div>

<style lang="postcss">
	.input {
		@apply block w-full rounded-md border border-slate-400 p-2 shadow-sm focus:border-primary;
	}
	.input.error {
		@apply border-red-500;
	}
	.label {
		@apply mb-1 cursor-pointer font-bold text-gray-800;
	}
	.error-message {
		@apply absolute -bottom-[1.3rem] left-0 inline-flex cursor-pointer items-center gap-1 text-sm text-red-500;
	}
</style>
