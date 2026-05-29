'use client';

import { useEffect, useRef } from 'react';

interface IUseKeyDownActionProps {
	key: KeyboardEvent['key'] | KeyboardEvent['key'][];
	ctrlKey?: boolean;
	metaKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	action: () => void;
}

export const useKeyDownAction = (
	options: IUseKeyDownActionProps | IUseKeyDownActionProps[]
): void => {
	const normalizedOptions = Array.isArray(options) ? options : [options];
	const optionsRef = useRef(normalizedOptions);

	useEffect(() => {
		optionsRef.current = normalizedOptions;
	});

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			for (const option of optionsRef.current) {
				const hasCtrlKey = typeof option.ctrlKey === 'boolean';
				const hasMetaKey = typeof option.metaKey === 'boolean';
				const hasShiftKey = typeof option.shiftKey === 'boolean';
				const hasAltKey = typeof option.altKey === 'boolean';

				if (Array.isArray(option.key)) {
					if (
						option.key.includes(e.key) &&
						(hasCtrlKey ? e.ctrlKey : true) &&
						(hasMetaKey ? e.metaKey : true) &&
						(hasShiftKey ? e.shiftKey : true) &&
						(hasAltKey ? e.altKey : true)
					) {
						option.action();
					}
				} else {
					if (
						e.key === option.key &&
						(hasCtrlKey ? e.ctrlKey : true) &&
						(hasMetaKey ? e.metaKey : true) &&
						(hasShiftKey ? e.shiftKey : true) &&
						(hasAltKey ? e.altKey : true)
					) {
						option.action();
					}
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
};
