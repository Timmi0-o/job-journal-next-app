'use client'

import { useGetThemeSettingsByCurrentTheme } from '@/components/widgets/theme-toggle/hooks/use-get-theme-settings-by-current-theme'
import { useGetUser } from '@/hooks/actions/user/use-get-user'
import {
	Avatar,
	Button,
	Popover,
	Separator,
	Spinner,
	toast,
} from '@heroui/react'
import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { IoLogOut, IoMoon, IoSunny } from 'react-icons/io5'
import styles from './sidebar-user-menu.module.css'
import {
	getSidebarUserDisplayName,
	getSidebarUserInitials,
	getSidebarUserSystemRoleLabel,
} from './utils/sidebar-user-menu.utils'

interface ISidebarUserMenuProps {
	isExpanded?: boolean
	placement?: 'top' | 'right' | 'bottom' | 'bottom end'
	variant?: 'sidebar' | 'mobile'
}

export const SidebarUserMenu = ({
	isExpanded = true,
	placement = 'top',
	variant = 'sidebar',
}: ISidebarUserMenuProps) => {
	const { data: session } = useSession()
	const sessionUser = session?.user
	const userId = sessionUser?.id

	const { data: userData, isLoading: isUserLoading } = useGetUser({
		userId,
		preset: 'BASE',
	})

	const [isMounted, setIsMounted] = useState(false)
	const { toggleTheme, resolvedTheme } = useGetThemeSettingsByCurrentTheme()

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true)
		}, 0)
	}, [])

	const displayName = getSidebarUserDisplayName(userData, sessionUser?.email)
	const initials = getSidebarUserInitials(userData, sessionUser?.email)
	const systemRoleLabel = getSidebarUserSystemRoleLabel(
		sessionUser?.role ?? userData?.role,
	)

	const isDarkTheme = resolvedTheme === 'dark'
	const isMobileVariant = variant === 'mobile'
	const isSidebarCollapsed = variant === 'sidebar' && !isExpanded

	const handleSignOut = async () => {
		toast.info('Выход из системы...', { isLoading: true })
		await signOut()
	}

	return (
		<Popover>
			<Popover.Trigger
				className={clsx({
					[styles.trigger]: !isMobileVariant,
				})}
			>
				{isMobileVariant ? (
					<button
						type='button'
						className={styles.mobile_trigger}
						aria-label='Меню пользователя'
					>
						<Avatar size='sm' color='accent'>
							<Avatar.Fallback>{initials}</Avatar.Fallback>
						</Avatar>
						<span className={styles.mobile_trigger_label}>Профиль</span>
					</button>
				) : (
					<Button
						variant='ghost'
						isIconOnly={isSidebarCollapsed}
						size={isExpanded ? 'md' : 'sm'}
						className={clsx(styles.trigger_button, {
							[styles.trigger_button_collapsed]: isSidebarCollapsed,
						})}
						aria-label='Меню пользователя'
					>
						<Avatar size='sm' color='accent'>
							<Avatar.Fallback>{initials}</Avatar.Fallback>
						</Avatar>
						{isExpanded ? (
							<span className={styles.trigger_label}>{displayName}</span>
						) : null}
					</Button>
				)}
			</Popover.Trigger>
			<Popover.Content placement={placement} className={styles.popover_content}>
				<Popover.Dialog className={styles.dialog}>
					{/* PROFILE */}
					{isUserLoading ? (
						<div className={styles.loading_state}>
							<Spinner size='sm' />
						</div>
					) : (
						<>
							<div className={styles.profile_section}>
								<Avatar size='md' color='accent'>
									<Avatar.Fallback>{initials}</Avatar.Fallback>
								</Avatar>
								<div className={styles.profile_text}>
									<p className={styles.profile_name}>{displayName}</p>
									<p className={styles.profile_email}>
										{sessionUser?.email ?? userData?.email ?? '—'}
									</p>
								</div>
							</div>

							<Separator className={styles.divider} />

							{/* META */}
							<dl className={styles.meta_list}>
								<div className={styles.meta_row}>
									<dt className={styles.meta_label}>Роль</dt>
									<dd className={styles.meta_value}>{systemRoleLabel}</dd>
								</div>
							</dl>
						</>
					)}

					<Separator className={styles.divider} />

					{/* ACTIONS */}
					<div className={styles.actions}>
						<div className={styles.actions_icons}>
							{isMounted ? (
								<Button
									isIconOnly
									variant='ghost'
									size='sm'
									aria-label={
										isDarkTheme
											? 'Переключить на светлую тему'
											: 'Переключить на тёмную тему'
									}
									className={styles.action_icon_button}
									onPress={toggleTheme}
								>
									{isDarkTheme ? <IoMoon size={17} /> : <IoSunny size={17} />}
								</Button>
							) : null}
						</div>
						<Button
							variant='danger-soft'
							size='sm'
							className={'text-[12px]'}
							onPress={handleSignOut}
						>
							<IoLogOut size={16} />
							<span>Выйти</span>
						</Button>
					</div>
				</Popover.Dialog>
			</Popover.Content>
		</Popover>
	)
}
