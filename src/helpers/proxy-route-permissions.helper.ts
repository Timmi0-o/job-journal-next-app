import {
	EUserRole,
	PROXY_ROUTE_PERMISSIONS,
} from '@/constants/proxy-route-permissions';

export const getRequiredRolesForPath = (
	pathname: string
): readonly EUserRole[] | undefined => {
	const matched = PROXY_ROUTE_PERMISSIONS.filter((item) =>
		pathname.startsWith(item.path)
	).sort((a, b) => b.path.length - a.path.length)[0];

	return matched?.roles;
};

export const hasUserRole = (
	userRole: string | undefined,
	requiredRoles: readonly EUserRole[]
): boolean => {
	if (!userRole) {
		return false;
	}

	return requiredRoles.includes(userRole as EUserRole);
};
