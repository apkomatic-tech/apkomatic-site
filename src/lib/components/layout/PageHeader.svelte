<script lang="ts">
	export let title: string;
</script>

<header class="mb-10 mt-10 md:mb-12">
	<h1 class="page-title text-4xl md:text-5xl">{title}</h1>
	<slot name="message" />
</header>

<style>
	.page-title {
		margin: 0;
	}
</style>
