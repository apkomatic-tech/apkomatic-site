<script lang="ts">
	import type { PageData } from './$types';
	import PostCard from '$lib/components/blog/PostCard.svelte';

	const { data }: { data: PageData } = $props();
	const { posts, metaTags, structuredData, breadcrumbData } = data;
</script>

<svelte:head>
	<title>{metaTags.title}</title>
	<meta name="description" content={metaTags.description} />
	<link rel="canonical" href={metaTags.canonical} />

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={metaTags.openGraph.title} />
	<meta property="og:description" content={metaTags.openGraph.description} />
	<meta property="og:type" content={metaTags.openGraph.type} />
	<meta property="og:url" content={metaTags.openGraph.url} />
	<meta property="og:image" content={metaTags.openGraph.image} />
	<meta property="og:site_name" content={metaTags.openGraph.siteName} />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content={metaTags.twitter.card} />
	<meta name="twitter:title" content={metaTags.twitter.title} />
	<meta name="twitter:description" content={metaTags.twitter.description} />
	<meta name="twitter:image" content={metaTags.twitter.image} />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbData)}</script>`}
</svelte:head>

<section class="py-16 lg:py-24">
	<div class="wrapper px-6 md:px-2">
		<!-- Page header -->
		<div class="mb-12 text-center">
			<h1
				class="page-title text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500"
			>
				Blog
			</h1>
			<p class="text-lg text-slate-600 max-w-2xl mx-auto">
				Discover our latest insights on web development, design trends, and technology. Stay updated
				with expert tips and industry knowledge.
			</p>
		</div>

		<!-- Blog posts grid -->
		{#if posts.length > 0}
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each posts as post}
					<PostCard {post} />
				{/each}
			</div>
		{:else}
			<!-- Empty state -->
			<div class="text-center py-16">
				<div class="mb-4 text-6xl">📝</div>
				<h2 class="text-2xl font-bold text-slate-800 mb-2">No blog posts yet</h2>
				<p class="text-slate-600">We're working on some great content. Check back soon!</p>
			</div>
		{/if}
	</div>
</section>
