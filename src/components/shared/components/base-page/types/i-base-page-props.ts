import { ReactNode } from 'react';

export interface IBasePageProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	titlePage?: string | ReactNode;
	breadcrumbs?: {
		label: string;
		href: string;
	}[];
	headerContent?: ReactNode;
}
