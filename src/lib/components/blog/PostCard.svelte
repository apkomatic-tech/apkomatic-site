<script lang="ts">
	import type { BlogPost } from '$lib/blog/posts.js';

	interface Props {
		post: BlogPost;
	}

	const { post }: Props = $props();

	// Format date for display
	const formatDate = (date: Date): string => {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Format reading time
	const formatReadingTime = (minutes: number): string => {
		return `${Math.ceil(minutes)} min read`;
	};
</script>

<article class="group" data-testid="post-card">
	<a
		href="/blog/{post.slug}"
		class="block rounded-md bg-white p-6 shadow-sm drop-shadow-sm transition-all duration-300 hover:shadow-md hover:drop-shadow-md"
	>
		<!-- Post metadata -->
		<div class="mb-3 flex items-center gap-3 text-sm text-slate-600">
			<time datetime={post.date.toISOString()} data-testid="post-date">
				{formatDate(post.date)}
			</time>
			<span>•</span>
			<span>{formatReadingTime(post.readingTime)}</span>
		</div>

		<!-- Post title -->
		<h2
			class="mb-3 text-xl font-bold text-black transition-colors duration-300 group-hover:text-primary"
		>
			{post.title}
		</h2>

		<!-- Post description -->
		<p class="mb-4 text-slate-700 line-clamp-3" data-testid="post-description">
			{post.description}
		</p>

		<!-- Tags -->
		{#if post.tags.length > 0}
			<div class="flex flex-wrap gap-2" data-testid="post-tags">
				{#each post.tags as tag}
					<span
						class="rounded-full bg-primaryLight px-3 py-1 text-xs font-medium text-primary"
						data-testid="tag"
					>
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</a>
</article>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
