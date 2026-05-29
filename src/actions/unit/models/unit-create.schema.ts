import { z } from 'zod';

export const UnitCreateSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Название обязательно' })
		.max(255, { message: 'Не более 255 символов' }),
});

export type IUnitCreate = z.infer<typeof UnitCreateSchema>;
