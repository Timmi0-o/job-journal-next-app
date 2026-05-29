import { entityMetaShape } from '@/actions/base-models/entity.schema';
import { z } from 'zod';

export const JobVariantSchema = z.object({
	...entityMetaShape,
	name: z.string(),
});

export type IJobVariant = z.infer<typeof JobVariantSchema>;
