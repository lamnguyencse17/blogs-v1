import { writable } from 'svelte/store';

export const defaultUserStore = { id: '', email: '', name: '' };

export const userStore = writable(defaultUserStore);
