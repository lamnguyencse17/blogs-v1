import type { LoadEvent } from '@sveltejs/kit';

export interface CustomLoadEvent extends Omit<LoadEvent, 'session'> {
	session: CustomSession;
}

export interface CustomSession extends App.Session {
	user?: {
		name: string;
		id: string;
		email: string;
	};
}
