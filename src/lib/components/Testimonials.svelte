<script lang="ts">
	import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
	import type { TestimonialType } from '$lib/types/TestimonialType';

	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		items: TestimonialType[];
	}

	let { items }: Props = $props();

	const sliderOptions: EmblaOptionsType = {
		slidesToScroll: 'auto'
	};
	let emblaAPI: EmblaCarouselType;
	let canScrollNext = $state(true);
	let canScrollPrev = $state(false);
	let scrollSnapList: number[] = $state([]);
	let activeIndex = $state(0);

	function updateCarouselState() {
		canScrollPrev = emblaAPI.canScrollPrev();
		canScrollNext = emblaAPI.canScrollNext();
		scrollSnapList = emblaAPI.scrollSnapList();
		activeIndex = emblaAPI.selectedScrollSnap();
	}

	function initSlider(event: CustomEvent<EmblaCarouselType>) {
		emblaAPI = event.detail;
		updateCarouselState();
		emblaAPI.on('select', updateCarouselState);
	}

	const handlePrev = (e: MouseEvent) => {
		e.preventDefault();
		emblaAPI.scrollPrev();
	};
	const handleNext = (e: MouseEvent) => {
		e.preventDefault();
		emblaAPI.scrollNext();
	};
</script>

{#snippet Testimonial({ content, author, company }: TestimonialType)}
	<div class="relative z-[1] h-full overflow-hidden rounded-md bg-white px-10 py-12 shadow-md">
		<p class="text-slate-700">
			{content}
		</p>
		<div class="my-7 ml-auto h-[6px] w-1/6 rounded-lg bg-primaryLight"></div>
		<div class="text-right">
			{#if author}
				<div class="font-serif font-bold text-primaryDark xl:text-lg">{author}</div>
			{/if}
			{#if company}
				<div class="text-sm text-slate-500">{company}</div>
			{/if}
		</div>
	</div>
{/snippet}

<div class="embla">
	<div
		class="embla__viewport md:px-7"
		use:emblaCarouselSvelte={{
			options: sliderOptions,
			plugins: []
		}}
		onemblaInit={initSlider}
		{...{ onemblaInit: initSlider } as any}
	>
		<div class="embla__container">
			{#each items as item}
				<div class="embla__slide">
					{@render Testimonial(item)}
				</div>
			{/each}
		</div>
	</div>
	<button
		class="embla__arrow embla__prev hidden disabled:pointer-events-none disabled:cursor-none disabled:opacity-10 md:block"
		aria-label="Previous"
		disabled={!canScrollPrev}
		onclick={handlePrev}
	>
		<Icon icon="mdi:chevron-left" />
		<span class="sr-only">Previous</span>
	</button>
	<button
		class="embla__arrow embla__next hidden disabled:pointer-events-none disabled:cursor-none disabled:opacity-10 md:block"
		aria-label="Next"
		disabled={!canScrollNext}
		onclick={handleNext}
	>
		<Icon icon="mdi:chevron-right" />
		<span class="sr-only">Next</span>
	</button>
	<div class="mt-8 flex justify-center gap-4">
		{#each scrollSnapList as snap, index}
			{@const isActive = index === activeIndex}
			<button
				class="h-4 w-4 rounded-full border-2 border-black"
				class:pointer-events-none={isActive}
				class:cursor-default={isActive}
				class:bg-black={isActive}
				aria-label={`slide ${index + 1}`}
				onclick={() => emblaAPI.scrollTo(index)}
			></button>
		{/each}
	</div>
</div>

<style lang="postcss">
	.embla {
		@apply relative mx-auto overflow-hidden;
		@apply max-w-screen-md;
	}
	.embla__arrow {
		@apply absolute top-1/2 z-[1] -translate-y-1/2 cursor-pointer text-[2.7rem] font-bold text-white opacity-70 disabled:pointer-events-none disabled:cursor-none disabled:opacity-10;
		@apply text-black;
	}
	.embla__prev {
		left: -11px;
	}
	.embla__next {
		right: -11px;
	}
	.embla__container {
		@apply grid auto-cols-[100%] grid-flow-col gap-[3.7rem];
	}
	.embla__slide {
		@apply min-w-0 max-w-full;
	}
</style>
