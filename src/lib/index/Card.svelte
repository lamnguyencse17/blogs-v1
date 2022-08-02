<script lang="ts">
	import { Card } from 'flowbite-svelte';

	export let id = '';
	export let title = '';
	export let subTitle = '';
</script>

<Card sveltekit:prefetch href={`/blogs/${id}`} class="min-w-full mt-4" {id}>
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		{title}
	</h5>
	<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
		{subTitle}
	</p>
</Card>
