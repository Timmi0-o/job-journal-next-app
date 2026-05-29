'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { DesktopNavigation } from './components/desktop-navigation/desktop-navigation';
import { MobileNavigation } from './components/mobile-navigation/mobile-navigation';

export const DashboardSidebar = () => {
	const isMobile = useMediaQuery('(max-width: 1024px)');

	if (isMobile) {
		return <MobileNavigation />;
	}

	return <DesktopNavigation />;
};
