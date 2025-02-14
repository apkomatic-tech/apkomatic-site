<script lang="ts">
	import { COMPANY_NAME } from '$lib/config/index.js';
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder.js';
	import Icon from '@iconify/svelte';

	let { data } = $props();

	const { project } = data;
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
			<div class="mb-4">
				<a href="/projects" class="button button--ghost button--withIcon">
					<span>&larr;</span> See All Projects
				</a>
			</div>
			<h1 class="mb-4 text-4xl lg:text-6xl">{project.name}</h1>
			<p>{project.description}</p>
			<div class="mt-8">
				<a
					href={project.url}
					target="_blank"
					class="button button--alt text-center"
					rel="noreferrer noopener"
				>
					View this project
				</a>
			</div>
		</div>
	</div>
</section>
