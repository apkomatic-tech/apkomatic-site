<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		if (dev) {
			console.log('Analytics not loaded in development mode');
			return;
		}
		// @ts-ignore
		if (typeof gtag !== 'undefined') {
			// @ts-ignore
			gtag('config', 'G-7ZQQDW6RY2', {
				title: document.title,
				page_path: $page.url.pathname
			});
		}
	});
</script>

<svelte:head>
	{#if !dev}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-7ZQQDW6RY2"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());
			gtag('config', 'G-7ZQQDW6RY2');
		</script>
	{/if}
</svelte:head>
