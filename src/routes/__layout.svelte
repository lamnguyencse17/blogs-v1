<script lang="ts">
	import { navigating, session } from '$app/stores';
	import Header from '$lib/components/header/Header.svelte';
	import type { CustomSession } from '$lib/types/auth/load';
	import { userStore } from '../store';
	import '../app.css';
	import { onMount } from 'svelte';
	$: if ($navigating) {
		const { user } = $session as CustomSession;
		if (user && user.id !== $userStore.id) {
			userStore.set(user);
		}
	}
	onMount(() => {
		const { user } = $session as CustomSession;
		if (user && user.id !== $userStore.id) {
			userStore.set(user);
		}
	});
</script>

<Header />

<main class="h-full">
	<div class="mx-12 h-full">
		<slot />
	</div>
</main>
