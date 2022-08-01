<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<div class="mx-12">
		<slot />
	</div>
</main>
