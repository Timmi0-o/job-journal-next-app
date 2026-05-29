import { z } from 'zod';
import { JournalCreateSchema } from './journal-create.schema';

export const JournalEditSchema = JournalCreateSchema.partial().extend({
	id: z.string(),
});

export type IJournalEdit = z.infer<typeof JournalEditSchema>;
