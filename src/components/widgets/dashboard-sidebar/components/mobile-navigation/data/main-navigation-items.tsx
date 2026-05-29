import { LuBookOpen, LuRuler, LuUser, LuWrench } from 'react-icons/lu';

export const MAIN_NAVIGATION_ITEMS = [
	{
		label: 'Журнал',
		icon: <LuBookOpen size={20} />,
		href: '/journals',
	},
	{
		label: 'Виды работ',
		icon: <LuWrench size={20} />,
		href: '/job-variants',
	},
	{
		label: 'Единицы',
		icon: <LuRuler size={20} />,
		href: '/units',
	},
	{
		label: 'Пользователи',
		icon: <LuUser size={20} />,
		href: '/users',
	},
];
