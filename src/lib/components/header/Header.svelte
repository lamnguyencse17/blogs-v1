<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi,
		Dropdown,
		DropdownItem,
		DropdownDivider
	} from 'flowbite-svelte';
	import logo from '$lib/assets/icon.svg';
	import { page } from '$app/stores';
	import { userStore } from '../../../store';

	$: isLoggedIn = $userStore.id !== '';
</script>

<header>
	<Navbar let:hidden let:toggle class="px-4 border border-b-gray-400">
		<NavBrand href="/">
			<img src={logo} class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				DEV'S TANGENT
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden} class="items-center">
			<NavLi href="/" active={$page.url.pathname === '/'}>Home</NavLi>
			<NavLi active={$page.url.pathname === '/about'}
				><a sveltekit:prefetch href="/about">About</a></NavLi
			>
			{#if isLoggedIn}
				<NavLi>
					<Dropdown size="sm" class="bg-white">
						<svelte:fragment slot="label">
							{$userStore.name}
						</svelte:fragment>
						<DropdownItem><a sveltekit:prefetch href="/editor">Create new article</a></DropdownItem>
						<DropdownDivider />
						<DropdownItem><a sveltekit:prefetch href="/logout">Sign out</a></DropdownItem>
					</Dropdown>
				</NavLi>
			{/if}
			{#if !isLoggedIn}
				<NavLi active={$page.url.pathname === '/login'}
					><a sveltekit:prefetch href="/login">Sign in</a></NavLi
				>
			{/if}
		</NavUl>
	</Navbar>
</header>
