import { IUser } from '@/actions/user/models/user.schema';
import { EUserRole, USER_ROLE_LABELS } from '@/enums/user.enum';

export const getSidebarUserDisplayName = (
	user: IUser | null | undefined,
	email?: string | null
): string => {
	if (!user) {
		return email ?? 'Пользователь';
	}

	const fullName = [user.surname, user.name, user.patronymic]
		.filter(Boolean)
		.join(' ')
		.trim();

	return fullName || user.email || email || 'Пользователь';
};

export const getSidebarUserInitials = (
	user: IUser | null | undefined,
	email?: string | null
): string => {
	if (user?.surname || user?.name) {
		const initials = [user.surname?.[0], user.name?.[0]]
			.filter(Boolean)
			.join('')
			.toUpperCase();

		if (initials) {
			return initials;
		}
	}

	const emailInitial = email?.[0]?.toUpperCase();

	return emailInitial || 'U';
};

export const getSidebarUserSystemRoleLabel = (role?: string | null): string => {
	if (!role) {
		return 'Не определена';
	}

	const roleLabel = USER_ROLE_LABELS[role as EUserRole];

	return roleLabel ?? role;
};
