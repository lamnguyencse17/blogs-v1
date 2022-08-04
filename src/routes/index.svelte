<script lang="ts">
	import Card from '$lib/components/index/Card.svelte';
	import Search from '$lib/components/index/Search.svelte';
	import type { IndexBlogs } from '.';
	export let blogs: IndexBlogs;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Dev's Tangent home page" />
</svelte:head>
<section>
	<Search />
	{#if blogs.length !== 0}
		{#each blogs as { id, title, subTitle, creator }}
			<Card {id} {title} {subTitle} {creator} />
		{/each}
	{/if}
</section>
