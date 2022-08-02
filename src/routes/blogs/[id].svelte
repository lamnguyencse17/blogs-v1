<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import type { SingleBlog } from './[id]';
	export let blogResponse: SingleBlog;
</script>

{#if !blogResponse}
	<div>Something went wrong</div>
{:else}
	{blogResponse.content}
	{blogResponse.subTitle}
{/if}
