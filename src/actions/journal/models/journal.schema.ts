import { entityMetaShape } from '@/actions/base-models/entity.schema';
import { z } from 'zod';

const journalRelationSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const JournalSchema = z.object({
	...entityMetaShape,
	jobVariantId: z.string(),
	amount: z.string(),
	unitId: z.string(),
	endDate: z.string(),
	unit: journalRelationSchema.optional(),
	jobVariant: journalRelationSchema.optional(),
});

export type IJournal = z.infer<typeof JournalSchema>;
