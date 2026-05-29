import { EUserRole, EUserStatus, USER_ROLE_LABELS, USER_STATUS_LABELS } from '@/enums/user.enum';

export const USER_ROLES = Object.values(EUserRole).map((role) => ({
	key: role,
	label: USER_ROLE_LABELS[role],
	value: role,
}));

export const USER_STATUSES = Object.values(EUserStatus).map((status) => ({
	key: status,
	label: USER_STATUS_LABELS[status],
	value: status,
}));
