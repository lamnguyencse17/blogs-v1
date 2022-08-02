<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Card from '$lib/index/Card.svelte';
	import Search from '$lib/index/Search.svelte';
	import type { IndexBlogs } from '.';
	export let blogs: IndexBlogs;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Dev's Tangent home page" />
</svelte:head>
<section>
	<Search />
	{#each blogs as { id, title, subTitle }}
		<Card {id} {title} {subTitle} />
	{/each}
</section>
