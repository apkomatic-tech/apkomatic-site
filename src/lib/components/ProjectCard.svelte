<script lang="ts">
	import { buildUrlFromImageSource } from '$lib/sanity/imageUrlBuilder';
	import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
	type ProjectItemProps = {
		id?: string;
		name?: string;
		description?: string;
		detailUrl?: string;
		client?: string;
		imageSource?: SanityImageSource;
	};

	export let item: ProjectItemProps;
	let imageUrl = item.imageSource
		? buildUrlFromImageSource(item.imageSource, { width: 1600, height: 1200 })
		: null;
</script>

<article class="grid-flow-rows my-8 grid gap-8 md:grid-cols-5 md:gap-0">
	<div class="flex items-center md:col-span-2">
		<div class="md:px-6 md:py-3 lg:px-12">
			<h2 class="mb-6 font-sans text-3xl md:text-4xl">{item.name}</h2>
			<p class="text-black text-opacity-80">{item.description}</p>
			<a href={item.detailUrl} class="button group mt-8">
				View Details <span
					class="inline-block transition-all duration-300 group-hover:translate-x-[3px]"
					>&rarr;</span
				>
			</a>
		</div>
	</div>
	{#if imageUrl}
		<div class="overflow-hidden md:col-span-3">
			<img src={imageUrl} alt={item.name} width={1600} height={1200} />
		</div>
	{/if}
</article>
