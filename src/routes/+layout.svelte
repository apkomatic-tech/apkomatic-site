<script>
	import Header from '$lib/layout/Header.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>Apkomatic</title>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@600;700&display=swap"
	/>
</svelte:head>

<Header />
<main>
	<slot />
</main>
