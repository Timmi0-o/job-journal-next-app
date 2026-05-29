'use client';

import { useSyncExternalStore } from 'react';

const isServerMatch = (): boolean => false;

export const useMediaQuery = (query: string): boolean => {
	const subscribe = (callback: () => void) => {
		const mediaQuery = window.matchMedia(query);
		mediaQuery.addEventListener('change', callback);
		return () => mediaQuery.removeEventListener('change', callback);
	};

	const isClientMatch = (): boolean => {
		return window.matchMedia(query).matches;
	};

	const isMatch = useSyncExternalStore(subscribe, isClientMatch, isServerMatch);

	return isMatch;
};
