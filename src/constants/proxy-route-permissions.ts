export enum EUserRole {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	USER = 'USER',
}

export interface IProxyRouteRoles {
	path: string;
	roles: readonly EUserRole[];
}

/**
 * RBAC по системной роли. Маршрут доступен, если роль пользователя входит в `roles`.
 * Маршруты, не указанные здесь, доступны любому аутентифицированному пользователю.
 */
export const PROXY_ROUTE_PERMISSIONS: readonly IProxyRouteRoles[] = [
	{
		path: '/users',
		roles: [EUserRole.SUPER_ADMIN, EUserRole.ADMIN],
	},
] as const;
