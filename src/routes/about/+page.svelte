<script>
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
</script>

<PageHeader title="About Apkomatic" />
<section class="generic-content mx-auto my-12 max-w-screen-lg px-2">
	<div class="flex flex-col gap-8">
		<div class="row">
			<h2 class="text-2xl">Who we are</h2>
			<p>
				We are Apkomatic, a one-stop shop for all things web development. We are a team of skilled
				and experienced developers who are passionate about creating beautiful, functional websites
				that help businesses like yours succeed online.
			</p>
		</div>
		<div class="row">
			<h2 class="text-2xl">Why work with us</h2>
			<p>
				We understand that every business is unique, which is why we work closely with our clients
				to understand their needs and goals, and create a customized solution that is tailored to
				their specific requirements. Whether you need a simple brochure website or a complex web
				application, we have the skills and expertise to deliver.
			</p>
		</div>
		<div class="row">
			<h2 class="text-2xl">Our Team</h2>
			<p>
				Our team is well-versed in the latest technologies and best practices, ensuring that your
				website is not only visually stunning but also fully optimized for performance and security.
				We also use responsive design techniques to ensure that your website looks great on any
				device.
			</p>
		</div>

		<div class="row">
			<h2 class="text-2xl">Our Mission</h2>
			<p>
				We pride ourselves on our commitment to customer service and strive to build long-term
				relationships with our clients. We are always available to answer any questions you may have
				and provide support throughout the development process and beyond.
			</p>
		</div>
	</div>
</section>

<style lang="postcss">
	.row {
		@apply items-center gap-16 lg:grid;
		grid-template-columns: minmax(auto, 300px) auto;
	}
</style>
