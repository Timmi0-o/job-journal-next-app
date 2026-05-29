import { z } from 'zod';

export const JobVariantCreateSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Название обязательно' })
		.max(255, { message: 'Не более 255 символов' }),
});

export type IJobVariantCreate = z.infer<typeof JobVariantCreateSchema>;
