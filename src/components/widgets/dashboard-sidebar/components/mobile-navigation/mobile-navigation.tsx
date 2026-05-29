'use client';

import { SidebarUserMenu } from '@/components/widgets/dashboard-sidebar/components/sidebar-user-menu/sidebar-user-menu';
import { Popover } from '@heroui/react';
import clsx from 'clsx';
import micromatch from 'micromatch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { LuChevronRight } from 'react-icons/lu';
import { SIDEBAR_LINKS } from '../../data/links/links';
import { MAIN_NAVIGATION_ITEMS } from './data/main-navigation-items';
import styles from './mobile-navigation.module.css';
import { IMobileNavItemProps } from './types/i-mobile-navigation-props';

const MobileNavItem = ({ item, onClose }: IMobileNavItemProps) => {
	const pathname = usePathname();

	const [isSubOpen, setIsSubOpen] = useState(false);
	const isSubItemsActive =
		item.items?.some((subItem) => {
			if (subItem.items?.length) {
				return subItem.items.some((nestedItem) => {
					if (!nestedItem.href) return false;
					return micromatch.isMatch(pathname, `**${nestedItem.href}`);
				});
			}

			if (!subItem.href) return false;
			return micromatch.isMatch(pathname, `**${subItem.href}`);
		}) ?? false;

	if (item.items && item.items.length > 0) {
		return (
			<Popover isOpen={isSubOpen} onOpenChange={setIsSubOpen}>
				<Popover.Trigger className={styles.menu_item_trigger}>
					<button
						type="button"
						aria-expanded={isSubOpen}
						aria-haspopup="menu"
						className={clsx(styles.menu_item, styles.menu_item_group, {
							[styles.active]: isSubItemsActive,
						})}
					>
						<span className={styles.menu_item_icon}>{item.icon}</span>
						<span className={styles.menu_item_content}>
							<span className={styles.menu_item_label}>{item.label}</span>
							<span className={styles.menu_item_hint}>Подразделы</span>
						</span>
						<span className={styles.menu_item_chevron} aria-hidden>
							<LuChevronRight size={16} />
						</span>
					</button>
				</Popover.Trigger>
				<Popover.Content
					placement="top"
					offset={10}
					className={styles.submenu_content}
				>
					<Popover.Dialog className="outline-none">
						<div className={styles.submenu_header}>
							<span className={styles.submenu_title}>{item.label}</span>
						</div>
						<div className={styles.submenu_list}>
							{item.items
								.filter((subItem) => !subItem.disabled)
								.map((subItem) => (
									<MobileNavItem
										key={subItem.label}
										item={subItem}
										onClose={() => {
											setIsSubOpen(false);
											onClose();
										}}
									/>
								))}
						</div>
					</Popover.Dialog>
				</Popover.Content>
			</Popover>
		);
	}

	if (!item.href) return null;

	const isActive = micromatch.isMatch(pathname, `**${item.href}`);

	return (
		<Link
			href={item.href}
			className={clsx(styles.menu_item, {
				[styles.active]: isActive,
			})}
			onClick={onClose}
		>
			<span className={styles.menu_item_icon}>{item.icon}</span>
			<span className={styles.menu_item_content}>
				<span className={styles.menu_item_label}>{item.label}</span>
			</span>
		</Link>
	);
};

export const MobileNavigation = () => {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const otherLinks = SIDEBAR_LINKS.filter(
		(link) =>
			!link.disabled &&
			!MAIN_NAVIGATION_ITEMS.some((main) => main.href === link.href)
	);
	const isMoreActive = otherLinks.some((link) => {
		if (link.items?.length) {
			if (!link.prefix) return false;
			return micromatch.isMatch(pathname, `/${link.prefix}/**`);
		}

		if (!link.href) return false;
		return micromatch.isMatch(pathname, `**${link.href}`);
	});

	return (
		<nav className={styles.mobile_nav}>
			<div className={styles.nav_container}>
				{MAIN_NAVIGATION_ITEMS.map((item) => {
					const sidebarLink = SIDEBAR_LINKS.find((l) => l.href === item.href);
					const hasSubItems =
						(sidebarLink?.items && sidebarLink.items.length > 0) ?? false;
					const activeMainItemPattern = sidebarLink?.prefix
						? `/${sidebarLink.prefix}/**`
						: `**${item.href}`;

					if (hasSubItems && sidebarLink) {
						return (
							<Popover key={item.href}>
								<Popover.Trigger>
									<button
										type="button"
										aria-label={item.label}
										className={clsx(styles.nav_item, {
											[styles.active]: micromatch.isMatch(
												pathname,
												activeMainItemPattern
											),
										})}
									>
										{item.icon}
										<span className={styles.nav_label}>{item.label}</span>
									</button>
								</Popover.Trigger>
								<Popover.Content
									placement="top"
									offset={10}
									className={styles.submenu_content}
								>
									<Popover.Dialog className="outline-none">
										<div className={styles.submenu_list}>
											{sidebarLink.items
												?.filter((subItem) => !subItem.disabled)
												.map((subItem) => (
													<MobileNavItem
														key={subItem.label}
														item={subItem}
														onClose={() => {}}
													/>
												))}
										</div>
									</Popover.Dialog>
								</Popover.Content>
							</Popover>
						);
					}

					const isActive = micromatch.isMatch(pathname, `**${item.href}`);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={clsx(styles.nav_item, {
								[styles.active]: isActive,
							})}
						>
							{item.icon}
							<span className={styles.nav_label}>{item.label}</span>
						</Link>
					);
				})}

				<SidebarUserMenu variant="mobile" placement="top" />

				<Popover isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
					<Popover.Trigger>
						<button
							type="button"
							className={clsx(styles.nav_item, {
								[styles.active]: isMoreActive,
							})}
							aria-label="Открыть дополнительное меню"
						>
							<HiMenuAlt2 size={20} />
							<span className={styles.nav_label}>Ещё</span>
						</button>
					</Popover.Trigger>
					<Popover.Content
						placement="top"
						offset={12}
						className={styles.menu_content}
					>
						<Popover.Dialog className="outline-none">
							<div className={styles.menu_header}>
								<span className={styles.menu_title}>Меню</span>
								<span className={styles.menu_description}>
									Дополнительные разделы и действия
								</span>
							</div>
							<div className={styles.menu_inner}>
								<div className={styles.menu_nav}>
									{otherLinks.map((link) => (
										<MobileNavItem
											key={link.label}
											item={link}
											onClose={() => setIsMenuOpen(false)}
										/>
									))}
								</div>
							</div>
						</Popover.Dialog>
					</Popover.Content>
				</Popover>
			</div>
		</nav>
	);
};
