'use client';

import { ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { RouterProvider } from 'react-aria-components';

export const UiProviders = ({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement => {
	const router = useRouter();

	const navigate = useMemo(
		(): ((href: string, options?: { replace?: boolean }) => void) =>
			(href, options) => {
				if (options?.replace) {
					router.replace(href);
				} else {
					router.push(href);
				}
			},
		[router]
	);

	const useHref = useCallback((href: string) => href, []);

	return (
		<RouterProvider navigate={navigate} useHref={useHref}>
			<ToastProvider />
			{children}
		</RouterProvider>
	);
};
