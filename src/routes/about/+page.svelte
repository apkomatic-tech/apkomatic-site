<script>
	import { COMPANY_NAME } from '$lib/config';
</script>

<svelte:head>
	<title>{COMPANY_NAME} - About</title>
</svelte:head>

<section class="wrapper">
	<h1 class="page-title">About Apkomatic</h1>
	<div class="flex flex-col gap-8">
		<div class="row">
			<h2 class="text-2xl lg:m-0"><span>Who we are</span></h2>
			<p>
				We are Apkomatic, a one-stop shop for all things web development. We are a team of skilled
				and experienced developers who are passionate about creating beautiful, functional websites
				that help businesses like yours succeed online.
			</p>
		</div>
		<div class="row">
			<h2 class="text-2xl lg:m-0"><span>Why work with us</span></h2>
			<p>
				We understand that every business is unique, which is why we work closely with our clients
				to understand their needs and goals, and create a customized solution that is tailored to
				their specific requirements. Whether you need a simple brochure website or a complex web
				application, we have the skills and expertise to deliver. <a class="link" href="/projects"
					>Check out our work &gt;</a
				>
			</p>
		</div>
		<div class="row">
			<h2 class="text-2xl lg:m-0"><span>Our Team</span></h2>
			<p>
				Our team is well-versed in the latest technologies and best practices, ensuring that your
				website is not only visually stunning but also fully optimized for performance and security.
				We also use responsive design techniques to ensure that your website looks great on any
				device.
			</p>
		</div>

		<div class="row">
			<h2 class="text-2xl lg:m-0"><span>Our Mission</span></h2>
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
		@apply items-center gap-16 lg:grid lg:min-h-[120px];
		grid-template-columns: minmax(auto, 300px) auto;
	}
	.row h2 > span {
		@apply inline-block border-b-2 border-accent pb-[5px];
	}
</style>
