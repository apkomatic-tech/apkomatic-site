<script lang="ts">
	export let title: string;
	export let subtext = '';
</script>

<header class="bg-primaryDark py-20 text-center">
	<h1 class="mb-6 text-4xl text-white md:text-5xl">{title}</h1>
	{#if subtext}
		<p class="mx-auto max-w-lg px-4 text-gray-100">{subtext}</p>
	{/if}
</header>
