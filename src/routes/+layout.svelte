<script>
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { COMPANY_NAME } from '$lib/config';
	import Analytics from '$lib/components/Analytics.svelte';

	onNavigate((navigation) => {
		// Do nothing if view transition API is not supported
		// @ts-ignore
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>{COMPANY_NAME}</title>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@600;700&display=swap"
	/>
</svelte:head>

<Analytics />
<Header />
<main>
	<slot />
</main>
<Footer />
