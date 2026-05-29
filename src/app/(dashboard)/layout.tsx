import { DashboardLayout as DashboardLayoutComponent } from '@/components/layouts/dashboard-layout/dashboard-layout';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}
