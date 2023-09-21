<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="wrapper my-12 text-center">
	{#if $page.status === 404}
		<h1 class="text-3xl">{$page.error?.message}.</h1>
	{:else}
		<h1 class="mb-4 text-3xl">Internal Error</h1>
		<p>Please refresh the page, or visit at a later time.</p>
	{/if}
</section>
