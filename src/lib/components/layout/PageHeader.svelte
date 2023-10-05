<script lang="ts">
	export let title: string;
	export let subtext: string | null = null;
	export let transparent = false;
</script>

<header class="header {transparent ? '' : 'bg-primaryDark'} py-20 text-center">
	<h1 class="mb-6 text-4xl {transparent ? '' : 'text-white'} md:text-5xl">{title}</h1>
	{#if subtext}
		<p class="mx-auto max-w-lg px-4 {transparent ? '' : 'text-gray-100'}">{subtext}</p>
	{/if}
</header>
