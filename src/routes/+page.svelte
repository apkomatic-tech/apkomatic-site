<script lang="ts">
	import Testimonial from '$lib/components/Testimonial.svelte';
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder';
	import Icon from '@iconify/svelte';
	import heroImage from '../images/hero.svg';
	import testimonialsImage from '../images/yellow-blob.svg';
	import { browser } from '$app/environment';

	export let data;
	let projectsElement: HTMLElement | null = null;

	function scrollToProjects() {
		if (projectsElement === null) {
			console.error('Scroll target element does not exist.');
			return;
		}

		const { y } = projectsElement.getBoundingClientRect();
		const top = Math.floor(y);
		setTimeout(() => {
			window.scrollTo({
				top,
				behavior: 'smooth'
			});
		}, 200);
	}
</script>

<section class="bg-primaryLight py-10 sm:py-24 lg:min-h-[60dvh]">
	<div class="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
		<div class="mr-auto place-self-center lg:col-span-7">
			<h1 class="mb-8 text-4xl font-extrabold tracking-tight text-primaryDark lg:text-5xl">
				We <span class="text-accentDark">speak</span> your language. <br /> We
				<span class="text-primary">code</span> your vision.
			</h1>
			<p class="mb-6 max-w-2xl text-lg text-slate-500 lg:mb-8 lg:text-xl">
				Unleash the full potential of your online presence with our expert web development services.
				From stunning website designs to custom web applications, we can bring your digital vision
				to life.
			</p>
			<div class="flex gap-4">
				{#if browser}
					<button
						type="button"
						class="button button--withIcon button--ghost group inline-flex items-center justify-center gap-2"
						on:click={scrollToProjects}
					>
						See Our Projects
						<Icon
							class="transition-transform duration-150 group-hover:translate-y-[1px] group-focus:translate-y-[1px]"
							icon="mdi:arrow-down"
						/>
					</button>
				{:else}
					<a href="/projects" class="button group inline-flex items-center gap-2">
						See Our Projects
					</a>
				{/if}

				<a href="/contact" class="button text-center"> Contact Us </a>
			</div>
		</div>
		<div class="hidden lg:col-span-5 lg:mt-0 lg:flex">
			<img src={heroImage} alt="mockup" />
		</div>
	</div>
</section>

<!-- Featured Projects -->
<section class="bg-white py-10 sm:py-24" bind:this={projectsElement}>
	<div class="wrapper px-6 md:px-2">
		<h2 class="mb-1 text-2xl text-primaryDark sm:text-center">Work</h2>
		<h3 class="text-4xl text-black md:text-center">Expertly Designed. Expertly Built.</h3>
		<!-- spacer -->
		<div class="my-8 w-1/4 max-w-sm rounded-lg border-b-[8px] border-accent sm:mx-auto sm:my-12" />

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
<section class="bg-primaryDark py-10 sm:py-24">
	<section class="wrapper px-6 md:px-2">
		<h3 class="text-4xl text-accentLight md:text-center">
			Unleash the full potential of your online presence.
		</h3>
		<div class="my-8 w-1/4 max-w-sm rounded-lg border-b-[8px] border-accent sm:mx-auto sm:my-12" />

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
<div class="relative bg-accentLight py-10 sm:py-24">
	<div class="wrapper relative z-10 px-6 md:px-2">
		<h3 class="text-4xl text-black md:text-center">What clients say about us</h3>
		<div class="my-8 w-1/4 max-w-sm rounded-lg border-b-[8px] border-black sm:mx-auto sm:my-12" />
		<div class="grid gap-[30px] md:grid-cols-2 lg:grid-cols-3">
			{#each data.testimonials as testimonial}
				<Testimonial data={testimonial} />
			{/each}
		</div>
	</div>
	<img
		aria-hidden
		class="absolute inset-0 h-full w-full object-cover"
		src={testimonialsImage}
		alt=""
	/>
</div>
