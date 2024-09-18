<script lang="ts">
	import type { TestimonialType } from '$lib/types/TestimonialType';

	export let data: TestimonialType;
	export let centeredClass: string = '';
</script>

<div
	class="relative z-[1] h-full overflow-hidden rounded-md bg-white px-10 py-12 shadow-md {centeredClass}"
>
	<p class="text-slate-700">
		{data.content}
	</p>
	<div class="my-7 ml-auto h-[6px] w-1/6 rounded-lg bg-primaryLight" />
	<div class="text-right">
		{#if data.author}
			<div class="font-serif font-bold text-primaryDark xl:text-lg">{data.author}</div>
		{/if}
		{#if data.company}
			<div class="text-sm text-slate-500">{data.company}</div>
		{/if}
	</div>
</div>
