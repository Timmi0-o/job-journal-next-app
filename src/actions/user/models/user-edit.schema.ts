import { z } from 'zod';
import { UserCreateSchema } from './user-create.schema';

export const UserEditSchema = UserCreateSchema.partial().extend({
	id: z.string(),
});

export type IUserEdit = z.infer<typeof UserEditSchema>;
