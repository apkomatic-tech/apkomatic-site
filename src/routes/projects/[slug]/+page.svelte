<script lang="ts">
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

<section class="wrapper my-12">
	<a
		href="/projects"
		class="mb-4 inline-block text-gray-800 underline hover:text-gray-700 hover:no-underline"
	>
		&larr; All Projects
	</a>
	<div class="grid gap-10 lg:grid-cols-2">
		<div class="relative h-auto overflow-hidden rounded-md shadow-2xl sm:max-h-max">
			<div class="absolute inset-0 z-[-1] h-full w-full bg-slate-300" />
			<img
				class="max-w-full sm:object-cover"
				width={projectImageWidth}
				height={projectImageHeight}
				src={projectImageUrl}
				alt={project.name}
			/>
		</div>
		<div>
			<h1 class="mb-4 text-4xl">{project.name}</h1>
			<p>{project.description}</p>
			<a
				href={project.url}
				target="_blank"
				class="button mt-8 inline-flex items-center gap-2"
				rel="noreferrer noopener"
			>
				View this project <Icon icon="mdi:open-in-new" class="text-2xl" />
			</a>
		</div>
	</div>
</section>
