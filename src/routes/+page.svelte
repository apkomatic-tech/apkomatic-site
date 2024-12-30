<script lang="ts">
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder';
	import Icon from '@iconify/svelte';
	import heroImage from '../images/layered-waves.svg';
	import testimonialsImage from '../images/yellow-blob.svg';

	import { superForm } from 'sveltekit-superforms/client';
	import { MESSAGE_CHAR_LIMIT } from '$lib/config';
	import Testimonials from '$lib/components/Testimonials.svelte';

	let { data } = $props();
	let showSuccessMessage = $state(false);

	const { form, enhance, errors, submitting, message, reset } = superForm(data.contactForm, {
		onError({ result }) {
			message.set(result.error.message);
		},
		onUpdated(event) {
			if (event.form.valid) {
				showSuccessMessage = true;
				reset();
			}
		}
	});
</script>

<section class="relative z-[1] overflow-x-hidden bg-primaryLight py-8 lg:min-h-[60dvh]">
	<img
		src={heroImage}
		alt="Layered Waves"
		class="absolute top-0 -z-[1] h-full w-full object-cover"
	/>
	<div class="mx-auto grid max-w-screen-2xl gap-8 p-4 md:grid-cols-2 lg:gap-16">
		<div class="flex flex-1 items-center">
			<div>
				<h1
					class="mb-4 mt-0 text-4xl font-extrabold tracking-tight text-primaryLight md:text-5xl lg:mb-8 lg:text-6xl"
				>
					Let us code your vision.
				</h1>
				<p class="mb-6 max-w-2xl text-xl text-white/80 lg:mb-8">
					Unleash the full potential of your online presence with our expert web development
					services. From stunning website designs to custom web applications, we can bring your
					digital vision to life.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<a href="/projects" class="button button--alt w-full text-center lg:w-auto">
						See Our Projects
					</a>
				</div>
			</div>
		</div>
		<!-- Contact Form -->
		<div class="flex-1 basis-80 rounded-md bg-white p-8 shadow-md">
			<div>
				<div class="mb-6 font-serif text-xl font-bold">Let’s Build Something Great Together!</div>
				{#if showSuccessMessage}
					<div class="my-4 inline-flex items-center gap-2 bg-green-100 p-2">
						<Icon width="32" height="32" icon="mdi:check-circle-outline" />
						<span class="leading-tight"
							><strong>Thank you!</strong> Your message has been received and we will respond to you
							shortly.
						</span>
					</div>
				{/if}
				<form use:enhance name="contact" method="post" action="?/contact">
					<div class="relative mb-4">
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
					<div class="relative mb-4">
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
					<div class="relative mb-4">
						<label for="email" class="label"> Message </label>
						<textarea
							id="message"
							name="contactMessage"
							placeholder={`Message`}
							rows={5}
							class="input"
							class:error={!!$errors.contactMessage}
							required
							maxlength={MESSAGE_CHAR_LIMIT}
							bind:value={$form.contactMessage}
						></textarea>
						<div class="mt-2 text-xs text-slate-500">
							Maximum message length is {MESSAGE_CHAR_LIMIT} characters
						</div>
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
						class="button block w-full px-16 disabled:opacity-50"
					>
						{$submitting ? 'Sending...' : 'Send'}
					</button>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- Featured Projects -->
<section class="bg-white py-8">
	<div class="wrapper px-6 md:px-2">
		<h2 class="text-4xl text-black md:text-center">Expertly Designed. Expertly Built.</h2>
		<!-- spacer -->
		<div
			class="my-8 w-1/4 max-w-sm rounded-lg border-b-[8px] border-accent sm:mx-auto sm:my-12"
		></div>

		<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each data.projects as project}
				{@const imageUrl = buildUrlFromImageSource(project.thumb, { width: 1000, height: 600 })}
				<a
					href="/projects/{project.slug}"
					class="group opacity-90 transition-opacity duration-300 hover:opacity-100"
				>
					<div class="mb-4 overflow-hidden rounded-md shadow-sm drop-shadow-sm">
						<img src={imageUrl} alt={project.name} loading="lazy" />
					</div>
					<div class="flex items-center gap-2 text-xl font-bold">
						{project.name}
					</div>
				</a>
			{/each}
		</div>
		<div class="mt-12 flex justify-center">
			<a
				class="button group inline-flex w-full items-center justify-center gap-2 md:w-auto md:px-20"
				href="/projects"
				>See All Projects <Icon
					icon="mdi:arrow-right"
					class="text-inherit transition-transform duration-150 group-hover:translate-x-1 group-focus:translate-x-1"
				/></a
			>
		</div>
	</div>
</section>

<!-- Featured Section -->
<section class="bg-primaryDark py-8">
	<section class="wrapper px-6 md:px-2">
		<h3 class="text-4xl text-accentLight md:text-center">
			Unleash the full potential of your online presence.
		</h3>
		<div
			class="my-8 w-1/4 max-w-sm rounded-lg border-b-[8px] border-accent sm:mx-auto sm:my-12"
		></div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-md bg-primary p-6 shadow-md">
				<div class="mb-3 font-serif text-2xl font-semibold text-white">Website Design</div>
				<div class="text-primaryLight">
					Our team of experienced designers will create a visually stunning website that reflects
					your brand and effectively showcases your products or services.
				</div>
			</div>
			<div class="rounded-md bg-primary p-6 shadow-md">
				<div class="mb-3 font-serif text-2xl font-semibold text-white">Custom Web Development</div>
				<div class="text-primaryLight">
					Need a custom web application or e-commerce platform? Our developers can create a
					fully-customized solution tailored to your specific needs.
				</div>
			</div>
			<div class="rounded-md bg-primary p-6 shadow-md">
				<div class="mb-3 font-serif text-2xl font-semibold text-white">Responsive Design</div>
				<div class="text-primaryLight">
					With more and more people accessing the internet on mobile devices, it's important to have
					a website that looks great and functions seamlessly on any device. Our responsive design
					services ensure that your website is optimized for all screen sizes.
				</div>
			</div>

			<div class="rounded-md bg-primary p-6 shadow-md">
				<div class="mb-3 font-serif text-2xl font-semibold text-white">Website Maintenance</div>
				<div class="text-primaryLight">
					Keep your website up-to-date and running smoothly with our maintenance services. We'll
					handle updates, backups, and security to ensure your site is always online and performing
					at its best.
				</div>
			</div>
			<div class="rounded-md bg-primary p-6 shadow-md">
				<div class="mb-3 font-serif text-2xl font-semibold text-white">
					Search Engine Optimization
				</div>
				<div class="text-primaryLight">
					Improve your search engine rankings and drive more traffic to your website with our SEO
					services. We'll work with you to develop a strategy that targets the right keywords and
					optimizes your site for the search engines.
				</div>
			</div>
			<div class="rounded-md bg-primary p-6 shadow-md">
				<div class="mb-3 font-serif text-2xl font-semibold text-white">Analytics and Reporting</div>
				<div class="text-primaryLight">
					We offer analytics and reporting services to track the performance of your website and
					provide valuable insights into how users are interacting with your site.
				</div>
			</div>
		</div>
	</section>
</section>

<!-- Testimonials -->
<div class="relative bg-accentLight py-8">
	<div class="wrapper relative z-10 px-6 md:px-2">
		<h3 class="text-4xl text-black md:text-center">What clients say about us</h3>
		<div
			class="my-8 w-1/4 max-w-sm rounded-lg border-b-[8px] border-black sm:mx-auto sm:my-12"
		></div>
		<Testimonials items={data.testimonials} />
	</div>
	<img
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover"
		src={testimonialsImage}
		alt=""
	/>
</div>

<!-- CTA -->
<div class="bg-primaryDark py-16 lg:py-32">
	<div class="wrapper flex max-w-2xl flex-col items-center justify-center gap-4 text-center">
		<h3 class="text-4xl font-bold text-accentLight">Ready to Elevate Your Online Presence?</h3>
		<p class="text-white/90">
			Our expert web development team creates stunning, functional websites tailored to your needs.
			Let’s bring your vision to life.
		</p>
		<a href="/contact" class="button button--secondaryLight">Contact Us Today</a>
	</div>
</div>

<style lang="postcss">
	.input {
		@apply block w-full rounded-md border-primary/10 bg-primaryLight p-2 focus:border-primary;
	}
	.input.error {
		@apply border-red-500;
	}
	.label {
		@apply mb-2 inline-block cursor-pointer font-bold text-gray-800;
	}
	.error-message {
		@apply absolute -bottom-[1.3rem] left-0 inline-flex cursor-pointer items-center gap-1 text-sm text-red-500;
	}
</style>
