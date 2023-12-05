<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { COMPANY_NAME } from '$lib/config';

	type FaqRow = {
		question: string;
		answer: string;
		isOpen: boolean;
	};

	let rows: Array<FaqRow> = [
		{
			question: 'How long will it take to build my website or app?',
			answer:
				"We estimate project timeframe based on the client's requirements. A common reason for project delay would be waiting for content (images and text) from the client. Depending on the project's complexity we generally take about 3-6 weeks to complete the project.",
			isOpen: false
		},
		{
			question: 'How about status updates?',
			answer:
				'For most projects it would be enough to communicate via email or telephone. We will keep you updated (frequently) via email.',
			isOpen: false
		},
		{
			question: 'Can I see progress during project development?',
			answer: 'We can demo the project once progress is made',
			isOpen: false
		},
		{
			question: 'Do you charge any extra (hidden) fees?',
			answer:
				'We discuss pricing at the beginning of the project. If you change or add new requirements after the project sign-off, we will need to determine a new quote based on the requirements. We will communicate this information to you before resuming work.',
			isOpen: false
		}
	];

	function toggleRow(index: number) {
		rows = rows.map((oi, i) => {
			if (index === i) {
				return { ...oi, isOpen: !oi.isOpen };
			}
			return oi;
		});
	}
</script>

<svelte:head>
	<title>{COMPANY_NAME} - FAQ</title>
</svelte:head>

<section class="page-content">
	<PageHeader title="Frequently Asked Questions" />
	<dl class="grid gap-2">
		{#each rows as row, index}
			<div class="border-b border-slate-300 py-4">
				<dt class="pb-4 font-bold">
					<button
						type="button"
						class="flex w-full items-center justify-between"
						on:click={() => toggleRow(index)}
					>
						<span>
							{row.question}
						</span>
						<span class="ml-2 h-8 w-8 font-normal text-slate-600">
							{#if row.isOpen}
								<!-- close (minus) -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
									><path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" /></svg
								>
							{:else}
								<!-- open (plus) -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
									><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" /></svg
								>
							{/if}
						</span>
					</button>
				</dt>
				<dd class="text-slate-700" class:hidden={!row.isOpen}>{row.answer}</dd>
			</div>
		{/each}
	</dl>
	<!-- {#each faqItems as item} -->
	<!-- <section class="grid gap-2 md:mb-8 md:grid-cols-3 md:gap-12">
			<h2 class="border-r-0 border-gray-300 font-semibold md:col-span-1 md:border-r md:pr-8">
				{item.question}
			</h2>
			<p class="text-black text-opacity-75 md:col-span-2">{item.answer}</p>
		</section> -->
	<!-- {/each} -->
</section>
