'use client';

import {
	ThemeProvider as NextThemesProvider,
	ThemeProviderProps,
	useTheme,
} from 'next-themes';
import { useEffect } from 'react';

function ThemeClassSync(): null {
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		if (resolvedTheme === undefined) return;
		const root = document.documentElement;
		root.setAttribute('class', resolvedTheme === 'dark' ? 'dark' : '');
		root.style.colorScheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	}, [resolvedTheme]);

	return null;
}

export const ThemeProvider = ({
	children,
	...props
}: ThemeProviderProps): React.ReactElement => {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			storageKey="job-journal-theme"
			themes={['light', 'dark']}
			enableSystem={false}
			{...props}
		>
			<ThemeClassSync />
			{children}
		</NextThemesProvider>
	);
};
