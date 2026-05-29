'use client';

import { Loader } from '@/components/shared/components/loader/loader';
import { AppLoader } from '@/components/widgets/app-loader/app-loader';
import { useIsClient } from '@/hooks/use-is-client';
import { dashboardSidebarStore } from '@/stores/dasboard-sidebar/dasboard-sidebar.store';
import { ToastProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DashboardSidebar } from '../../widgets/dashboard-sidebar/dashboard-sidebar';
import styles from './dashboard-layout.module.css';
import { IDashboardLayoutProps } from './types/i-dashboard-layout-props';

export const DashboardLayout = observer(({ children }: IDashboardLayoutProps) => {
	const isClient = useIsClient();
	const [queryClient] = useState(() => new QueryClient());

	const { isExpanded } = dashboardSidebarStore;

	if (!isClient) {
		return <AppLoader />;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<AppLoader />

			<div className={styles.container}>
				<DashboardSidebar />
				<Loader>
					<div
						className={styles.content}
						data-sidebar={isExpanded ? 'expanded' : 'collapsed'}
					>
						{children}
					</div>
					<ToastProvider maxVisibleToasts={20} placement="top" />
				</Loader>
			</div>
		</QueryClientProvider>
	);
});
