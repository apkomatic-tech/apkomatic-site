<script lang="ts">
	import { COMPANY_NAME } from '$lib/config/index.js';
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder.js';

	let { data } = $props();
	let { projects } = data;
	const imageWidth = 1024;
	const imageHeight = 800;
</script>

<svelte:head>
	<title>{COMPANY_NAME} - Projects</title>
</svelte:head>

<div class="wrapper">
	<h1 class="page-title">Projects</h1>
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project}
			{@const imageUrl = buildUrlFromImageSource(project.thumb, {
				width: imageWidth,
				height: imageHeight
			})}
			<a
				href="/projects/{project.slug}"
				class="group opacity-90 transition-opacity duration-300 hover:opacity-100"
			>
				<div class="mb-4 overflow-hidden rounded-md shadow-sm drop-shadow-sm">
					<img
						src={imageUrl}
						alt={project.name}
						loading="lazy"
						width={imageWidth}
						height={imageHeight}
					/>
				</div>
				<div class="flex items-center gap-2 text-xl font-bold">
					{project.name}
				</div>
			</a>
		{/each}
	</div>
</div>
