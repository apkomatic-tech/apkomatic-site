<script lang="ts">
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder';
	import Icon from '@iconify/svelte';
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

<section class="hero relative z-[1] overflow-x-hidden bg-primaryLight py-8 lg:min-h-[60dvh]">
	<div class="mx-auto grid max-w-screen-2xl gap-8 p-4 md:grid-cols-2 lg:gap-16">
		<div class="flex flex-1 items-center">
			<div>
				<h1
					class="mb-4 mt-0 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl lg:mb-8 lg:text-6xl"
				>
					Let us code your vision.
				</h1>
				<p class="mb-6 max-w-2xl text-xl text-slate-600 lg:mb-8">
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
		<div class="flex-1 basis-80 rounded-md bg-primaryLight p-8">
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
<section class="bg-primaryLight py-8">
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
	.hero {
		background-color: #ffffff;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 304 304' width='304' height='304'%3E%3Cpath fill='%239c9c9c' fill-opacity='0.07' d='M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V210h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'%3E%3C/path%3E%3C/svg%3E");
	}
	.input {
		@apply block w-full rounded-md border-primary/10 bg-white p-2 focus:border-primary;
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
