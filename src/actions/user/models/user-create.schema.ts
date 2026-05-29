import { EUserRole, EUserStatus } from '@/enums/user.enum';
import { z } from 'zod';

export const UserCreateSchema = z.object({
	surname: z.string().min(1, { message: 'Фамилия обязательна' }).max(255),
	name: z.string().min(1, { message: 'Имя обязательно' }).max(255),
	patronymic: z.string().max(255).nullable(),
	email: z
		.string()
		.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Некорректный email' })
		.max(255),
	phone: z.string().max(50).nullable(),
	status: z.nativeEnum(EUserStatus),
	role: z.nativeEnum(EUserRole),
	password: z
		.string()
		.min(8, { message: 'Минимум 8 символов' })
		.max(255),
});

export type IUserCreate = z.infer<typeof UserCreateSchema>;
