'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { dashboardSidebarStore } from '@/stores/dasboard-sidebar/dasboard-sidebar.store';
import { useEffect, useMemo, useState } from 'react';

export const useGetMaxTableWidth = () => {
	const [windowWidth, setWindowWidth] = useState(() =>
		typeof window !== 'undefined' ? window.innerWidth : 0
	);
	const isExpanded = dashboardSidebarStore.isExpanded;

	const isMobile = useMediaQuery('(max-width: 1024px)');

	const SIDEBAR_WIDTH_EXPANDED = 300;
	const SIDEBAR_WIDTH_COLLAPSED = isMobile ? 0 : 75;
	const CONTAINER_GAP = 8;
	const CONTENT_PADDING = 10;

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const maxTableWidth = useMemo(() => {
		if (windowWidth === 0) return 0;

		const sidebarWidth = isExpanded
			? SIDEBAR_WIDTH_EXPANDED
			: SIDEBAR_WIDTH_COLLAPSED;

		const availableWidth =
			windowWidth - sidebarWidth - CONTAINER_GAP - CONTENT_PADDING;

		return Math.max(availableWidth, 0);
	}, [windowWidth, isExpanded]);

	return maxTableWidth;
};
