<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
	import type { TestimonialType } from '$lib/types/TestimonialType';

	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Testimonial from './Testimonial.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		items: TestimonialType[];
	}

	let { items }: Props = $props();

	const sliderOptions: EmblaOptionsType = {
		slidesToScroll: 'auto'
	};
	let emblaAPI: EmblaCarouselType = $state();
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

	function emblaInit(event: CustomEvent<EmblaCarouselType>) {
		emblaAPI = event.detail;
		updateCarouselState();
		emblaAPI.on('select', updateCarouselState);
	}

	const handlePrev = () => emblaAPI.scrollPrev();
	const handleNext = () => emblaAPI.scrollNext();
</script>

<div class="embla">
	<div
		class="embla__viewport md:px-7"
		use:emblaCarouselSvelte={{
			options: sliderOptions,
			plugins: []
		}}
		onemblaInit={emblaInit}
	>
		<div class="embla__container">
			{#each items as item}
				<div class="embla__slide">
					<Testimonial data={item} />
				</div>
			{/each}
		</div>
	</div>
	<button
		class="embla__arrow embla__prev hidden disabled:pointer-events-none disabled:cursor-none disabled:opacity-10 md:block"
		aria-label="Previous"
		disabled={!canScrollPrev}
		onclick={preventDefault(handlePrev)}
	>
		<Icon icon="mdi:chevron-left" />
		<span class="sr-only">Previous</span>
	</button>
	<button
		class="embla__arrow embla__next hidden disabled:pointer-events-none disabled:cursor-none disabled:opacity-10 md:block"
		aria-label="Next"
		disabled={!canScrollNext}
		onclick={preventDefault(handleNext)}
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
