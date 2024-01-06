<script lang="ts">
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
			id: 'faq',
			label: 'FAQ',
			href: '/frequently-asked-questions'
		}
	];
	let isMobileMenuOpen = false;

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

	$: {
		if (browser) {
			if (isMobileMenuOpen) {
				document.body.classList.add('overflow-hidden', 'touch-none');
			} else {
				document.body.classList.remove('overflow-hidden', 'touch-none');
			}
		}
	}
</script>

<header class="site-header relative z-[9999] bg-primaryDark text-primaryLight">
	<div class="wrapper mb-0 flex items-center justify-between px-6 py-4">
		<SiteLogo />
		<!-- Mobile menu toggle -->
		<button
			type="button"
			class="block translate-x-[6px] p-[6px] text-[40px] text-primaryLight sm:hidden"
			on:click={toggleMenu}
			aria-label="Menu"
			aria-controls="nav-menu"
		>
			<span class="sr-only">Menu</span>
			<Icon icon="jam:menu" />
		</button>
		<!-- Desktop Navigation -->
		<nav class="hidden grid-flow-col sm:grid sm:gap-3 md:gap-8">
			{#each navLinks as { id, label, href }}
				{@const isCurrentPage = $page.url.pathname === href}
				<a
					class="relative leading-none transition-opacity duration-300 hover:opacity-75 {isCurrentPage
						? 'text-accent'
						: 'text-primaryLight'}"
					{href}
					>{label}
					{#if isCurrentPage}
						<span
							aria-hidden
							class="marker bottom-0 left-0 right-0 block h-[3px] translate-y-[3px] rounded-sm bg-accent"
						/>
					{/if}</a
				>
			{/each}
		</nav>

		<!-- Mobile Navigation -->
		{#if isMobileMenuOpen}
			<div
				in:slide={{ axis: 'x', duration: 100, easing: quartIn }}
				out:slide={{ axis: 'x', duration: 100, easing: quartOut }}
				class="fixed right-0 top-0 z-50 h-full w-full bg-primaryDark px-6 pb-2 sm:hidden"
			>
				<div class="flex h-[96px] items-start justify-end">
					<button
						type="button"
						class="inline-flex translate-x-[6px] items-center place-self-center p-[6px] text-center text-4xl leading-none text-primaryLight"
						on:click={closeMobileNav}
					>
						<span class="sr-only">Close</span>
						<Icon icon="iconamoon:close" />
					</button>
				</div>
				<nav class="grid grid-flow-row-dense gap-1 border-t border-white border-opacity-10 pt-4">
					{#each navLinks as { id, label, href }}
						<a
							class="inline-block rounded-md border border-transparent px-4 py-2 font-sans text-base font-semibold text-purple-100 transition duration-150 ease-in-out hover:border-[rgba(0,0,0,.15)] hover:bg-[rgba(0,0,0,.16)] hover:text-white hover:text-opacity-100 {$page
								.url.pathname === href
								? 'border-[rgba(0,0,0,.15)] bg-[rgba(0,0,0,.16)] text-white'
								: ''}"
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
