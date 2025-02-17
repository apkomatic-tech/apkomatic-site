<script lang="ts">
	import { run } from 'svelte/legacy';

	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { quartOut, quartIn } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	import SiteLogo from './SiteLogo.svelte';

	const navLinks: Array<{
		id: string;
		label: string;
		href: string;
	}> = [
		{
			id: 'home',
			label: 'Home',
			href: '/'
		},
		{
			id: 'about',
			label: 'About',
			href: '/about'
		},
		{
			id: 'projects',
			label: 'Projects',
			href: '/projects'
		},
		{
			id: 'contact',
			label: 'Contact',
			href: '/contact'
		},
		{
			id: 'frequently-asked-questions',
			label: 'FAQ',
			href: '/frequently-asked-questions'
		}
	];
	let isMobileMenuOpen = $state(false);

	function toggleMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileNav() {
		isMobileMenuOpen = false;
	}

	// close menu when navigating between pages
	afterNavigate(() => {
		isMobileMenuOpen = false;
	});

	run(() => {
		if (browser) {
			if (isMobileMenuOpen) {
				document.body.classList.add('overflow-hidden', 'touch-none');
			} else {
				document.body.classList.remove('overflow-hidden', 'touch-none');
			}
		}
	});
</script>

<header class="site-header relative z-[9999] px-4">
	<div class={`max-w-screen-2xl mx-auto mb-0 flex items-center justify-between py-4 px-0`}>
		<SiteLogo />
		<!-- Mobile menu toggle -->
		<button
			type="button"
			class="block translate-x-[6px] p-[6px] text-[40px] sm:hidden"
			onclick={toggleMenu}
			aria-label="Menu"
			aria-controls="nav-menu"
		>
			<span class="sr-only">Menu</span>
			<Icon icon="jam:menu" />
		</button>
		<!-- Desktop Navigation -->
		<nav class="hidden grid-flow-col sm:grid sm:gap-3 md:gap-8">
			{#each navLinks as { id, label, href }}
				{@const isHomepage = $page.url.pathname === '/' && id === 'home'}
				{@const isCurrentPage = $page.url.pathname.replaceAll('/', '').includes(id)}
				<a
					class="relative leading-none text-black transition-opacity duration-300 hover:opacity-75"
					{href}
					>{label}
					{#if isCurrentPage || isHomepage}
						<span
							aria-hidden="true"
							class="marker bottom-0 left-0 right-0 block h-[3px] translate-y-[3px] rounded-sm bg-black"
						></span>
					{/if}</a
				>
			{/each}
		</nav>

		<!-- Mobile Navigation -->
		{#if isMobileMenuOpen}
			<div
				in:slide={{ axis: 'x', duration: 50, easing: quartIn }}
				out:slide={{ axis: 'x', duration: 50, easing: quartOut }}
				class="fixed right-0 top-0 z-50 h-full w-full bg-white px-6 pb-2 sm:hidden"
			>
				<div class="flex h-[96px] items-start justify-end">
					<button
						type="button"
						class="inline-flex translate-x-[6px] items-center place-self-center p-[6px] text-center text-4xl leading-none text-black"
						onclick={closeMobileNav}
					>
						<span class="sr-only">Close</span>
						<Icon icon="iconamoon:close" />
					</button>
				</div>
				<nav
					class="grid justify-center grid-flow-row-dense border-t border-white border-opacity-10 pt-4 gap-4"
				>
					{#each navLinks as { id, label, href }}
						{@const isHomepage = $page.url.pathname === '/' && id === 'home'}
						{@const isCurrentPage = $page.url.pathname.replaceAll('/', '').includes(id)}
						<a
							class="inline-block w-fit font-sans text-2xl font-semibold border-b-4 {isCurrentPage ||
							isHomepage
								? ' border-primaryLighter'
								: 'border-transparent'}"
							{href}>{label}</a
						>
					{/each}
				</nav>
			</div>
		{/if}
	</div>
</header>

<style>
	.site-header {
		view-transition-name: site-header;
	}
	.marker {
		view-transition-name: indicator;
	}
</style>
