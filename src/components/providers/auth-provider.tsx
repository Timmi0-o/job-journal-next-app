'use client';

import { SessionProvider } from 'next-auth/react';

export const AuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement => {
	return <SessionProvider>{children}</SessionProvider>;
};
