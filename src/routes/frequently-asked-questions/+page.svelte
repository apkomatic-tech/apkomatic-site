<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';

	const faqItems: Array<{ question: string; answer: string }> = [
		{
			question: 'How long will it take to build my website or app?',
			answer:
				"We estimate project timeframe based on the client's requirements. A common reason for project delay would be waiting for content (images and text) from the client. Depending on the project's complexity we generally take about 3-6 weeks to complete the project."
		},
		{
			question: 'How about status updates?',
			answer:
				'For most projects it would be enough to communicate via email or telephone. We will keep you updated (frequently) via email.'
		},
		{
			question: 'Can I see progress during project development?',
			answer: 'We can demo the project once progress is made'
		},
		{
			question: 'Do you charge any extra (hidden) fees?',
			answer:
				'We discuss pricing at the beginning of the project. If you change or add new requirements after the project sign-off, we will need to determine a new quote based on the requirements. We will communicate this information to you before resuming work.'
		}
	];
</script>

<PageHeader title="Frequently Asked Questions" transparent={true} />
<section class="page-content">
	{#each faqItems as item}
		<section class="grid gap-2 md:mb-8 md:grid-cols-3 md:gap-12">
			<h2 class="border-r-0 border-gray-300 font-semibold md:col-span-1 md:border-r md:pr-8">
				{item.question}
			</h2>
			<p class="text-black text-opacity-75 md:col-span-2">{item.answer}</p>
		</section>
	{/each}
</section>
