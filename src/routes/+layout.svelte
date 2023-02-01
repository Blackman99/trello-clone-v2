<script>
	import '../app.css';

	const signout = () => {
		console.log('signout');
	};
</script>

<nav class="flex justify-between w-full px-20 py-4 bg-bleu-primary">
	<a href="/">
		<h1 class="text-bleu-dark text-2xl font-semibold">Trello-Clone V2</h1>
	</a>
	<div class="flex gap-2">
		<button
			on:click={signout}
			class="border-bleu-dark border-2 px-4 rounded-md text-lg self-stretch hover:bg-bleu-dark hover:text-bleu-primary transition-all ease-in-out duration-150"
			>Sign Out</button
		>
		<a
			href="/me"
			class="border-bleu-dark border-2 px-4 rounded-md text-lg self-stretch hover:bg-bleu-dark hover:text-bleu-primary transition-all ease-in-out duration-150"
			>My Account</a
		>
	</div>
</nav>
<div class="px-20 py-10  mb-auto">
	<slot />
</div>
