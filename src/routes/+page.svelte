<script lang="ts">
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder';
	import Icon from '@iconify/svelte';
	import testimonialsDecorImage from '../images/yellow-blob.svg';

	import Testimonials from '$lib/components/Testimonials.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { projects, testimonials } = data;
</script>

<section
	class="gradient-bg relative z-[1] overflow-hidden from-slate-300 to-black py-20 md:py-28 lg:py-32"
>
	<div class="mx-auto max-w-screen-2xl px-4">
		<h1
			class="mb-4 mt-0 mx-auto text-5xl text-center xl:max-w-[50vw] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 md:text-6xl lg:mb-8 lg:text-7xl xl:text-9xl"
		>
			Let us code your vision.
		</h1>
		<p class="mt-4 text-center text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto text-slate-600/90">
			Empowering businesses with innovative technology and creative design. Let's build something
			extraordinary together.
		</p>
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
			{#each projects as project}
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
				class="button button--primary group inline-flex w-full items-center justify-center gap-2 md:w-auto md:px-20"
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
<section class="gradient-bg py-8">
	{#snippet featuredBucket(title: string, description: string)}
		<div class="rounded-md bg-white/30 p-6">
			<div class="mb-3 font-serif text-2xl font-semibold text-black">{title}</div>
			<div class="text-slate-800/90">
				{description}
			</div>
		</div>
	{/snippet}
	<section class="wrapper px-6 md:px-2">
		<h3 class="text-4xl text-black/80 md:text-center">
			Unleash the full potential of your online presence.
		</h3>
		<div
			class="my-8 w-1/4 max-w-sm rounded-lg border-b-[8px] border-black sm:mx-auto sm:my-12"
		></div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{@render featuredBucket(
				'Website Design',
				`Our team of experienced designers will create a visually stunning website that reflects your brand and effectively showcases your products or services.`
			)}
			{@render featuredBucket(
				'Custom Web Development',
				`Need a custom web application or e-commerce platform? Our developers can create a
					fully-customized solution tailored to your specific needs.`
			)}
			{@render featuredBucket(
				'Responsive Design',
				`Our responsive design
					services ensure that your website is optimized for all screen sizes.`
			)}
			{@render featuredBucket(
				'Website Maintenance',
				`Keep your website up-to-date and running smoothly with our maintenance services. We'll
					handle updates, backups, and security to ensure your site is always online and performing
					at its best.`
			)}
			{@render featuredBucket(
				'Search Engine Optimization',
				`Improve your search engine rankings and drive more traffic to your website with our SEO
					services. We'll work with you to develop a strategy that targets the right keywords and
					optimizes your site for the search engines.`
			)}
			{@render featuredBucket(
				'Analytics and Reporting',
				`We offer analytics and reporting services to track the performance of your website and
					provide valuable insights into how users are interacting with your site.`
			)}
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
		<Testimonials items={testimonials} />
	</div>
	<img
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover"
		src={testimonialsDecorImage}
		alt=""
	/>
</div>

<!-- CTA -->
<div class="gradient-bg py-16 lg:py-32">
	<div class="wrapper flex max-w-2xl flex-col items-center justify-center gap-6 text-center">
		<h3 class="text-3xl md:text-4xl font-bold text-black/80">
			Ready to Elevate Your Online Presence?
		</h3>
		<p class="text-black/70 text-xl">
			Our expert web development team creates stunning, functional websites tailored to your needs.
			Let’s bring your vision to life.
		</p>

		<a href="/contact" class="button button--primary">Contact Us Today</a>
	</div>
</div>

<style>
	.gradient-bg {
		background: linear-gradient(90deg, #f9dffd 0%, #ddd9ff 100%);
	}
</style>
