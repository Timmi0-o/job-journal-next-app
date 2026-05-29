'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const hardLogout = async (): Promise<void> => {
	const cookieStore = await cookies();

	const cookiesToDelete = [
		'authjs.callback-url',
		'authjs.csrf-token',
		'next-auth.callback-url',
		'next-auth.csrf-token',
	];

	for (const cookieName of cookiesToDelete) {
		cookieStore.delete(cookieName);
	}

	redirect('/login');
};
