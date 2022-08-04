<script context="module" lang="ts">
	import type { CustomLoadEvent } from '$lib/types/auth/load';
	import type { Load } from '@sveltejs/kit';
	import { get } from 'svelte/store';
	import { userStore } from '../store';

	export const load: Load = ({ session }: CustomLoadEvent) => {
		const user = get(userStore);
		if (user.id !== '') {
			return {
				status: 302,
				redirect: '/'
			};
		}
	};
</script>

<script lang="ts">
	import { Input, Label, Button } from 'flowbite-svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { loginSchema, type LoginSchemaType } from '../lib/types/auth/login';
	import { goto, prefetch } from '$app/navigation';

	const { form } = createForm({
		onSubmit: async (values: LoginSchemaType) => {
			prefetch('/');
			const response = await fetch('/login', {
				method: 'POST',
				body: JSON.stringify(values),
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json'
				}
			});
			if (!response.ok) {
				console.log((await response.json()).message);
				return;
			}
			const user = await response.json();
			userStore.set(user);
			goto('/');
		},
		extend: validator({ schema: loginSchema })
	});
</script>

<form use:form>
	<div class="mb-6">
		<Label for="email" class="block mb-2">Email</Label>
		<Input id="email" placeholder="Email" type="email" name="email" />
	</div>
	<div class="mb-6">
		<Label for="password" class="block mb-2">Password</Label>
		<Input id="password" type="password" placeholder="Password" name="password" />
	</div>
	<Button type="submit">Sign in</Button>
</form>
