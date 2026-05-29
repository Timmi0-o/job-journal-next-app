'use client';

import { useTheme } from 'next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';

export const useGetThemeSettingsByCurrentTheme = () => {
	const { theme, setTheme, resolvedTheme } = useTheme();

	const toggleTheme = (): void => {
		if (theme === 'light') {
			setTheme('dark');
		} else {
			setTheme('light');
		}
	};

	const getIcon = (): React.ReactNode => {
		switch (theme) {
			case 'light':
				return <FiSun size={20} />;
			case 'dark':
				return <FiMoon size={20} />;
		}
	};

	const getLabel = (): string => {
		switch (theme) {
			case 'light':
				return 'Светлая';
			case 'dark':
				return 'Тёмная';
			default:
				return 'Неизвестная';
		}
	};

	return {
		toggleTheme,
		getIcon,
		getLabel,
		resolvedTheme,
	};
};
