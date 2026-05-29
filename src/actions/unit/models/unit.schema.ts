import { entityMetaShape } from '@/actions/base-models/entity.schema';
import { z } from 'zod';

export const UnitSchema = z.object({
	...entityMetaShape,
	name: z.string(),
});

export type IUnit = z.infer<typeof UnitSchema>;
