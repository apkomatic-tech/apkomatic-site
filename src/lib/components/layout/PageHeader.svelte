<script lang="ts">
	export let title: string;
	export let subtext: string | null = null;
</script>

<header class="mb-10 mt-10 md:mb-12">
	<h1 class="page-title text-4xl md:text-5xl">{title}</h1>
	{#if subtext}
		<p class="mt-4 text-slate-700">{subtext}</p>
	{/if}
</header>

<style>
	.page-title {
		margin: 0;
	}
</style>
