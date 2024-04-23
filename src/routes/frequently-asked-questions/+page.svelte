<script lang="ts">
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
				"We estimate the project time frame based on the client's requirements. A common reason for project delays is the wait for content (images and text) from the client. Depending on the project's complexity, we typically require about 3-6 weeks to complete it.",
			isOpen: false
		},
		{
			question: 'How about status updates?',
			answer:
				'For most projects, communication through email or telephone will suffice. We will provide frequent updates via email.',
			isOpen: false
		},
		{
			question: 'Can I see progress during project development?',
			answer: 'We can provide a project demonstration once progress has been made.',
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

<section class="wrapper-narrow">
	<h1 class="page-title">Frequently Asked Questions</h1>
	<dl class="grid gap-2">
		{#each rows as row, index}
			<div class="border-b border-slate-300 first:border-t">
				<dt class="font-bold">
					<button
						type="button"
						class="flex w-full items-center justify-between gap-6 py-4"
						on:click={() => toggleRow(index)}
					>
						<span class="text-left">
							{row.question}
						</span>
						<span class="inline-block text-2xl font-light text-slate-600">
							{#if row.isOpen}
								<!-- close (minus) -->
								&minus;
							{:else}
								<!-- open (plus) -->
								&plus;
							{/if}
						</span>
					</button>
				</dt>
				<dd class="pb-4 pt-2 text-slate-700" class:hidden={!row.isOpen}>{row.answer}</dd>
			</div>
		{/each}
	</dl>
</section>
