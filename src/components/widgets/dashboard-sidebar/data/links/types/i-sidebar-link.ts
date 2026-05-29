export interface ISidebarLink {
	label: string;
	icon: React.ReactNode;
	href?: string;
	disabled: boolean;
	prefix?: string;
	items?: ISidebarLink[];
}

export type SidebarSectionPosition = 'top' | 'bottom';

export interface ISidebarSection {
	position: SidebarSectionPosition;
	title: string;
	links: ISidebarLink[];
}
