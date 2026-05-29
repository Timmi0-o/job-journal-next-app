/**
 * Форматирует дату в строку "День Месяц Год ЧЧ:ММ" (ru-RU).
 */
export const FormatDate = (dateObject: Date): string => {
	const datePart = dateObject.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
	const timePart = dateObject.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	const capitalizedDate = datePart.charAt(0).toUpperCase() + datePart.slice(1);

	return `${capitalizedDate} ${timePart}`;
};

/** Дата и время: «ДД.ММ.ГГГГ – ЧЧ:ММ». */
export const FormatDateTime = (dateObject: Date): string => {
	const datePart = dateObject.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
	const timePart = dateObject.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	return `${datePart} – ${timePart}`;
};
