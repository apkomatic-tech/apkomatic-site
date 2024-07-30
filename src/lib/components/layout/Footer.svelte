<script>
	import Icon from '@iconify/svelte';
</script>

<footer>
	<div class="wrapper mb-0 border-t border-slate-200 py-6">
		<div class="text-center text-sm text-slate-700">
			&copy; {new Date().getFullYear()}, Apkomatic
		</div>
		<nav class="mt-2 flex justify-center">
			<a
				class="inline-block text-2xl text-slate-700 transition-all duration-200 hover:text-primary"
				title="Apkomatic Instagram"
				aria-label="Apkomatic Instagram"
				rel="noreferrer noopener"
				target="_blank"
				href="https://instagram.com/apkomatic"
			>
				<Icon icon="mdi:instagram" />
			</a>
		</nav>
	</div>
</footer>
