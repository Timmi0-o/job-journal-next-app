'use client';

import { useEffect, useState } from 'react';

export const useGetServerTime = () => {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	const moscowDate = now.toLocaleDateString('ru-RU', {
		timeZone: 'Europe/Moscow',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
	const moscowTime = now.toLocaleTimeString('ru-RU', {
		timeZone: 'Europe/Moscow',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});
	const moscowDateTimeFull = `${moscowDate.charAt(0).toUpperCase() + moscowDate.slice(1)} ${moscowTime}`;

	return {
		moscowTime,
		moscowDateTimeFull,
	};
};
