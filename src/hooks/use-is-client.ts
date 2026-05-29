'use client';

import { useLayoutEffect, useState } from 'react';

export const useIsClient = (): boolean => {
	const [isClient, setIsClient] = useState(false);

	useLayoutEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
};
