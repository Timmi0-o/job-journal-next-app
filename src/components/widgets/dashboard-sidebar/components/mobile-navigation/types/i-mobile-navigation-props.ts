import { ISidebarLink } from '../../../data/links/types/i-sidebar-link';

export interface IMobileNavItemProps {
	item: ISidebarLink;
	onClose: () => void;
}
