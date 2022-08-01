<script lang="ts">
	import { Navbar, NavBrand, NavHamburger, NavUl, NavLi } from 'flowbite-svelte';
	import logo from '$lib/assets/icon.svg';
	import { page } from '$app/stores';
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
		<NavUl {hidden}>
			<NavLi href="/" active={$page.url.pathname === '/'}>Home</NavLi>
			<NavLi href="/about" active={$page.url.pathname === '/about'}>About</NavLi>
		</NavUl>
	</Navbar>
</header>
