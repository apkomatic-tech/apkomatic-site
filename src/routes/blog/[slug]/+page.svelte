<script lang="ts">
	import type { PageData } from './$types';
	import PostContent from '$lib/components/blog/PostContent.svelte';

	const { data }: { data: PageData } = $props();
	const { post, metaTags, structuredData, breadcrumbData } = data;
</script>

<svelte:head>
	<title>{metaTags.title}</title>
	<meta name="description" content={metaTags.description} />
	<link rel="canonical" href={metaTags.canonical} />
	<meta name="author" content={metaTags.openGraph.article.author} />

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={metaTags.openGraph.title} />
	<meta property="og:description" content={metaTags.openGraph.description} />
	<meta property="og:type" content={metaTags.openGraph.type} />
	<meta property="og:url" content={metaTags.openGraph.url} />
	<meta property="og:image" content={metaTags.openGraph.image} />
	<meta property="og:site_name" content={metaTags.openGraph.siteName} />
	<meta property="article:published_time" content={metaTags.openGraph.article.publishedTime} />
	<meta property="article:author" content={metaTags.openGraph.article.author} />
	{#each metaTags.openGraph.article.tags as tag}
		<meta property="article:tag" content={tag} />
	{/each}

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
		<PostContent {post} />

		<!-- Navigation back to blog -->
		<div class="mt-12 pt-8 border-t border-slate-200">
			<a
				href="/blog"
				class="inline-flex items-center gap-2 text-primary hover:text-primaryDark transition-colors duration-300"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Back to Blog
			</a>
		</div>
	</div>
</section>
