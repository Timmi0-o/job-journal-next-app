import { z } from 'zod';

export const JobVariantEditSchema = z.object({
	id: z.string(),
	name: z
		.string()
		.min(1, { message: 'Название обязательно' })
		.max(255, { message: 'Не более 255 символов' })
		.optional(),
});

export type IJobVariantEdit = z.infer<typeof JobVariantEditSchema>;
