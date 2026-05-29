export const toDatetimeLocal = (iso: string): string => {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return '';
	const offset = date.getTimezoneOffset() * 60_000;
	return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const fromDatetimeLocal = (value: string): string => {
	return new Date(value).toISOString();
};
