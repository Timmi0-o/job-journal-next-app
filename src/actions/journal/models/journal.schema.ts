import { entityMetaShape } from '@/actions/base-models/entity.schema';
import { z } from 'zod';

export const JournalSchema = z.object({
	...entityMetaShape,
	jobVariantId: z.string(),
	amount: z.string(),
	unitId: z.string(),
	endDate: z.string(),
});

export type IJournal = z.infer<typeof JournalSchema>;
