<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder.js';

	export let data;
	const imageWidth = 1024;
	const imageHeight = 800;
</script>

<PageHeader title="Projects" />
<div class="page-content">
	<div class="grid grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-3">
		{#each data.projects as project}
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
