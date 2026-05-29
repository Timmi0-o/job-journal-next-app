import { entityMetaShape } from '@/actions/base-models/entity.schema';
import { EUserRole, EUserStatus } from '@/enums/user.enum';
import { z } from 'zod';

export const UserSchema = z.object({
	...entityMetaShape,
	surname: z.string(),
	name: z.string(),
	patronymic: z.string().nullable().optional(),
	email: z.string(),
	phone: z.string().nullable().optional(),
	status: z.nativeEnum(EUserStatus),
	role: z.nativeEnum(EUserRole),
});

export type IUser = z.infer<typeof UserSchema>;
