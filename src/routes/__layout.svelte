<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main class="h-full">
	<div class="mx-12 h-full">
		<slot />
	</div>
</main>
