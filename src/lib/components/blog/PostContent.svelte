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

<article class="mx-auto max-w-4xl">
	<!-- Post header -->
	<header class="mb-8">
		<!-- Post title -->
		<h1 class="mb-4 text-4xl font-bold text-black md:text-5xl" data-testid="post-title">
			{post.title}
		</h1>

		<!-- Post metadata -->
		<div class="mb-6 flex flex-wrap items-center gap-4 text-slate-600">
			<time datetime={post.date.toISOString()} class="text-sm" data-testid="post-date">
				{formatDate(post.date)}
			</time>
			<span class="text-sm">•</span>
			<span class="text-sm">{formatReadingTime(post.readingTime)}</span>
		</div>

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
	</header>

	<!-- Post content -->
	<div
		class="prose prose-lg prose-slate max-w-none prose-headings:text-black prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-black prose-code:text-primary prose-code:bg-primaryLight prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-pre:bg-slate-900 prose-pre:text-slate-100"
		data-testid="post-content"
	>
		{@html post.content}
	</div>
</article>
