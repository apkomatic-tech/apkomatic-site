<script lang="ts">
	import Testimonial from '$lib/components/Testimonial.svelte';
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder';
	import Icon from '@iconify/svelte';
	import heroImage from '../images/layered-waves-a.svg';
	import testimonialsImage from '../images/yellow-blob.svg';

	export let data;
</script>

<section class="hero md:py-18 relative flex items-center overflow-hidden py-10 sm:py-20">
	<img aria-hidden class="absolute inset-0 h-full w-full object-cover" src={heroImage} alt="" />
	<div class="relative mx-auto px-6">
		<h1 class="mb-6 leading-none">
			<div
				class="pr-1 text-center text-[58px] font-semibold tracking-tight text-white sm:text-[68px] md:text-[86px] lg:text-[100px]"
			>
				Custom Web <br /> Solutions.
			</div>
		</h1>
		<div class="mb-8">
			<p class="my-2 max-w-[800px] text-center text-slate-300">
				Unleash the full potential of your online presence with our expert web development services.
				From stunning website designs to custom web applications, we can bring your digital vision
				to life.
			</p>
		</div>

		<div class="grid auto-cols-max grid-flow-col justify-center gap-4">
			<button class="button group inline-flex items-center">
				<span class="mr-2">See Our Projects</span>{' '}
				<!-- <HiArrowRight class="origin-center translate-x-0 transition-transform duration-200 group-hover:translate-x-1" /> -->
			</button>
			<a href="/contact" class="button button--alt text-center"> Contact Us </a>
		</div>
	</div>
</section>

<!-- Featured Projects -->
<section class="bg-white py-10 sm:py-24">
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
					<div class="mb-4">
						<img src={imageUrl} alt={project.name} />
					</div>
					<div class="flex items-center gap-2 text-xl font-bold">
						{project.name}<Icon
							class="transition-transform duration-150 group-hover:translate-x-1 group-focus:translate-x-1"
							icon="mdi:arrow-right"
						/>
					</div>
				</a>
			{/each}
		</div>
		<div>
			<a class="button group inline-flex items-center gap-2 text-center" href="/projects"
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

<style>
	.hero {
		min-height: calc(100vh - 96px);
	}
</style>
