<script>
	import { COMPANY_NAME } from '$lib/config';
	import rocketImage from '/src/images/coding-rocket.svg';
</script>

<svelte:head>
	<title>{COMPANY_NAME} - About</title>
</svelte:head>

<section class="wrapper">
	<h1 class="page-title">About Us</h1>
	<div class="grid gap-6 lg:gap-16 grid-cols-1 lg:grid-cols-[minmax(400px,_1fr)_2fr]">
		<figure class="">
			<img
				src={rocketImage}
				class="max-w-[300px] block mx-auto lg:w-full lg:max-w-full"
				alt=""
				aria-hidden="true"
			/>
		</figure>
		<div class="space-y-6">
			<div class="row">
				<h2 class="mb-6 text-2xl"><span>Who we are</span></h2>
				<p>
					We're passionate about creating websites that truly connect with businesses like yours.
					Our experience and knowledge of the latest trends and techniques ensures that we craft
					solutions that are tailored to your unique needs. We're not just developers, we're
					collaborators who are committed to making a real difference in the online presence of your
					business. Let's work together to create something truly special.
				</p>
			</div>
			<div class="row">
				<h2 class="mb-6 text-2xl"><span>Why work with us</span></h2>
				<p>
					We take the time to listen to our clients and craft a personalized solution that perfectly
					meets their unique needs. We believe that every business has a unique voice and story, and
					we are committed to helping them share that with the world. Whether you need a simple
					brochure site or a complex web application, we have the skills and passion to bring your
					vision to life. Take a look at some of our <a href="/projects">previous work</a> and see the
					difference we can make.
				</p>
			</div>

			<div class="row">
				<h2 class="mb-6 text-2xl"><span>Our Mission</span></h2>
				<p>
					We're all about creating a deep and meaningful connection with our clients. We take pride
					in delivering exceptional service and ensuring that you feel special and valued at every
					step of your journey with us. From the initial consultation to the final launch, we're
					here to support and guide you every step of the way, and beyond. Our unwavering dedication
					and commitment to our clients is what sets us apart, and it's what will make your online
					presence truly memorable and truly special in a way that only you can achieve.
				</p>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	.wrapper {
		@apply px-6;
	}
	.row h2 > span {
		@apply inline-block border-b-[6px] border-accent pb-[5px];
	}
</style>
