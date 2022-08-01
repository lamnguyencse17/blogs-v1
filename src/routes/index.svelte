<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Card from '$lib/index/Card.svelte';
	import Search from '$lib/index/Search.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Search />
	<Card
		id={12}
		title={'Noteworthy technology acquisitions 2021'}
		subTitle={'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.'}
	/>
</section>
