<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { MESSAGE_CHAR_LIMIT } from '$lib/config';
	import Icon from '@iconify/svelte';

	export let data;
	const { form, enhance, errors, submitting } = superForm(data.form);
</script>

<PageHeader title="Contact Us" />
<section
	class="mx-auto my-6 max-w-screen-md rounded-md bg-white p-6 shadow-sm drop-shadow-sm sm:my-12"
>
	<form use:enhance name="contact" method="post" novalidate>
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
			/>
			{#if $errors.contactMessage?.length}
				<label for="message" class="error-message">
					<Icon icon="mdi:alert" />
					{$errors.contactMessage[0]}
				</label>
			{/if}
		</div>
		<button type="submit" disabled={$submitting} class="button block px-16 disabled:opacity-50">
			{$submitting ? 'Sending...' : 'Send'}
		</button>
	</form>
</section>

<style lang="postcss">
	.input {
		@apply block w-full rounded-sm border-2 border-transparent bg-primaryLight p-2 focus:border-primary;
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
