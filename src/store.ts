import { writable, derived } from 'svelte/store';

export const userStore = writable({
	id: '',
	name: '',
	email: ''
});
