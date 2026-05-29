export enum EUserRole {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	USER = 'USER',
}

export enum EUserStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	PENDING = 'PENDING',
	BLOCKED = 'BLOCKED',
}

export const USER_ROLE_LABELS: Record<EUserRole, string> = {
	[EUserRole.SUPER_ADMIN]: 'Супер-админ',
	[EUserRole.ADMIN]: 'Админ',
	[EUserRole.USER]: 'Пользователь',
};

export const USER_STATUS_LABELS: Record<EUserStatus, string> = {
	[EUserStatus.ACTIVE]: 'Активен',
	[EUserStatus.INACTIVE]: 'Неактивен',
	[EUserStatus.PENDING]: 'Ожидает',
	[EUserStatus.BLOCKED]: 'Заблокирован',
};

export const EUserRolesRu = USER_ROLE_LABELS;
export const EUserStatusRu = USER_STATUS_LABELS;

export const EUserRolesColorMap: Record<
	EUserRole,
	'default' | 'accent' | 'success' | 'warning' | 'danger'
> = {
	[EUserRole.SUPER_ADMIN]: 'danger',
	[EUserRole.ADMIN]: 'accent',
	[EUserRole.USER]: 'default',
};

export const EUserStatusColorMap: Record<
	EUserStatus,
	'default' | 'accent' | 'success' | 'warning' | 'danger'
> = {
	[EUserStatus.ACTIVE]: 'success',
	[EUserStatus.INACTIVE]: 'default',
	[EUserStatus.PENDING]: 'warning',
	[EUserStatus.BLOCKED]: 'danger',
};
