'use client';

import { EUserRole } from '@/enums/user.enum';
import { useSession } from 'next-auth/react';

/**
 * Клиентская проверка системной роли пользователя из сессии.
 */
export const usePermission = (): {
	role: EUserRole | undefined;
	hasRole: (roles: EUserRole[]) => boolean;
	isAdmin: boolean;
} => {
	const { data: session } = useSession();
	const role = session?.user?.role as EUserRole | undefined;

	const hasRole = (roles: EUserRole[]): boolean =>
		role !== undefined && roles.includes(role);

	return {
		role,
		hasRole,
		isAdmin: hasRole([EUserRole.SUPER_ADMIN, EUserRole.ADMIN]),
	};
};
