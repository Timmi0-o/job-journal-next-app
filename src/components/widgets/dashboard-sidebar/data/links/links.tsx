import { LuBookOpen, LuClipboardList, LuRuler, LuUser, LuWrench } from 'react-icons/lu';
import { ISidebarLink, ISidebarSection } from './types/i-sidebar-link';

export const SIDEBAR_SECTIONS: ISidebarSection[] = [
	{
		position: 'top',
		title: 'Журнал',
		links: [
			{
				label: 'Записи журнала',
				icon: <LuBookOpen size={18} />,
				href: '/journals',
				disabled: false,
			},
			{
				label: 'Виды работ',
				icon: <LuWrench size={18} />,
				href: '/job-variants',
				disabled: false,
			},
			{
				label: 'Единицы измерения',
				icon: <LuRuler size={18} />,
				href: '/units',
				disabled: false,
			},
		],
	},
	{
		position: 'top',
		title: 'Администрирование',
		links: [
			{
				label: 'Пользователи',
				icon: <LuUser size={18} />,
				href: '/users',
				disabled: false,
			},
		],
	},
];

function collectSectionLinks(sections: readonly ISidebarSection[]): ISidebarLink[] {
	const result: ISidebarLink[] = [];
	for (const section of sections) {
		result.push(...section.links);
	}
	return result;
}

export const SIDEBAR_LINKS: ISidebarLink[] = collectSectionLinks(SIDEBAR_SECTIONS);
