<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { userStore } from '../store';
	import { getStores } from '$app/stores';
	import { goto, prefetch } from '$app/navigation';

	let timedRedirect: NodeJS.Timeout | undefined;
	const { session } = getStores();

	userStore.set({ id: '', email: '', name: '' });
	session.set({ id: '', email: '', name: '' });
	onMount(() => {
		prefetch('/');
		timedRedirect = setTimeout(() => {
			goto('/');
		}, 2000);
	});
	onDestroy(() => {
		clearTimeout(timedRedirect);
	});
</script>

<section class="flex flex-col mx-auto items-center justify-center min-h-full">
	<div class="text-2xl text-blue-700">We are working on it...</div>
	<Spinner class="text-center fill-blue-700" size="8" />
</section>
