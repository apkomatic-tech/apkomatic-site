<script lang="ts">
	import { COMPANY_NAME } from '$lib/config/index.js';
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder.js';
	import Icon from '@iconify/svelte';

	export let data;

	const project = data.project;
	const projectImageWidth = 1600;
	const projectImageHeight = 1200;
	const projectImageUrl = buildUrlFromImageSource(data.project.thumb, {
		width: projectImageWidth,
		height: projectImageHeight
	});
</script>

<svelte:head>
	<title>{COMPANY_NAME} - Project - {project.name}</title>
</svelte:head>

<section class="wrapper my-12">
	<div class="grid gap-10 lg:grid-cols-2">
		<div class="relative h-auto rounded-md bg-gray-400 sm:max-h-max">
			<img
				class="max-w-full"
				width={projectImageWidth}
				height={projectImageHeight}
				src={projectImageUrl}
				alt={project.name}
			/>
		</div>
		<div class="@container">
			<h1 class="mb-4 text-4xl">{project.name}</h1>
			<p>{project.description}</p>
			<div class="mt-8 grid grid-cols-1 gap-4 @lg:grid-cols-2">
				<a href="/projects" class="button button--ghost button--withIcon">
					<Icon icon="radix-icons:pin-left" class="text-2xl" /> View All Projects
				</a>
				<a
					href={project.url}
					target="_blank"
					class="button button--withIcon"
					rel="noreferrer noopener"
				>
					View this project <span class="link-icon-wrapper">
						<Icon icon="ph:link-light" class="text-2xl" />
					</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.link-icon-wrapper {
		transform: rotate(0.2turn);
	}
</style>
