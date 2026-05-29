import { z } from 'zod';

export const UnitEditSchema = z.object({
	id: z.string(),
	name: z
		.string()
		.min(1, { message: 'Название обязательно' })
		.max(255, { message: 'Не более 255 символов' })
		.optional(),
});

export type IUnitEdit = z.infer<typeof UnitEditSchema>;
