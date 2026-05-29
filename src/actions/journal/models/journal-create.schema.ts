import { z } from 'zod';

const DECIMAL_PATTERN = /^[0-9]+(\.[0-9]+)?$/;

export const JournalCreateSchema = z.object({
	jobVariantId: z.string().uuid({ message: 'Некорректный идентификатор работы' }),
	amount: z
		.string()
		.min(1, { message: 'Количество обязательно' })
		.regex(DECIMAL_PATTERN, { message: 'Количество должно быть числом' }),
	unitId: z.string().uuid({ message: 'Некорректная единица измерения' }),
	endDate: z
		.string()
		.min(1, { message: 'Дата окончания обязательна' })
		.refine((value) => !Number.isNaN(Date.parse(value)), {
			message: 'Некорректная дата',
		}),
});

export type IJournalCreate = z.infer<typeof JournalCreateSchema>;
