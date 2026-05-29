import { SidebarUserMenu } from '@/components/widgets/dashboard-sidebar/components/sidebar-user-menu/sidebar-user-menu';
import { dashboardSidebarStore } from '@/stores/dasboard-sidebar/dasboard-sidebar.store';
import { Button, Separator, Tooltip } from '@heroui/react';
import clsx from 'clsx';
import micromatch from 'micromatch';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { LuClipboardList } from 'react-icons/lu';
import { SIDEBAR_SECTIONS } from '../../data/links/links';
import {
	ISidebarLink,
	ISidebarSection,
} from '../../data/links/types/i-sidebar-link';
import { SidebarItemGroupLinks } from '../sidebar-item-group-links/sidebar-item-group-links';
import styles from './desktop-navigation.module.css';
import { ServerTimeSection } from './server-time-section';

export const DesktopNavigation = observer(() => {
	const router = useRouter();
	const pathname = usePathname();

	const { isExpanded, setIsExpanded } = dashboardSidebarStore;

	return (
		<div
			className={clsx(styles.sidebar_container, {
				[styles.expanded]: isExpanded,
				[styles.collapsed]: !isExpanded,
			})}
		>
			<div className={styles.header}>
				<div
					className={clsx(styles.logo_wrapper, {
						[styles.centered]: !isExpanded,
						[styles.left_aligned]: isExpanded,
					})}
					onClick={() => router.push('/')}
				>
					<div
						className={clsx(styles.logo_icon, {
							[styles.active]: micromatch.isMatch(pathname, `/`),
							[styles.inactive]: !micromatch.isMatch(pathname, `/`),
						})}
						aria-label="Журнал работ"
					>
						<LuClipboardList size={18} />
					</div>
					{isExpanded ? <h1 className={styles.title}>Журнал работ</h1> : null}
				</div>
				<div className={styles.actions}>
					<Button
						isIconOnly
						variant="ghost"
						className={styles.toggle_button}
						aria-label={isExpanded ? 'Свернуть меню' : 'Развернуть меню'}
						onPress={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? (
							<IoIosArrowBack size={18} />
						) : (
							<IoIosArrowForward size={18} />
						)}
					</Button>
				</div>
			</div>
			<div className={styles.links}>
				{SIDEBAR_SECTIONS.map((section: ISidebarSection) => {
					const enabledLinks = section.links.filter(
						(link: ISidebarLink) => !link.disabled
					);
					const singleLinks = enabledLinks.filter((link) => link.href);
					const groupLinks = enabledLinks.filter((link) => link.items?.length);

					return (
						<div
							key={section.title}
							className={clsx(
								section.position === 'bottom' ? styles.section_bottom : undefined,
								{
									['w-full']: isExpanded,
								}
							)}
						>
							{isExpanded ? (
								<div className={styles.section_header}>{section.title}</div>
							) : null}
							{singleLinks.map((link) =>
								link.href ? (
									<div
										key={link.label}
										className={clsx('flex justify-start flex-col w-full', {
											['items-center']: !isExpanded,
											['items-start']: isExpanded,
										})}
									>
										{!isExpanded ? (
											<Tooltip delay={250}>
												<Tooltip.Trigger className="w-full mx-auto">
													<Link
														href={link.href === pathname ? '#' : link.href}
														aria-label={link.label}
														aria-disabled={link.disabled}
													>
														<div
															className={clsx(styles.link_button, {
																[styles.active]: micromatch.isMatch(
																	pathname,
																	`**${link.href}`
																),
																[styles.inactive]: !micromatch.isMatch(
																	pathname,
																	`**${link.href}`
																),
																[styles.centered]: !isExpanded,
																[styles.left_aligned]: isExpanded,
															})}
														>
															<span className={styles.link_content}>
																{link.icon}
															</span>
														</div>
													</Link>
												</Tooltip.Trigger>
												<Tooltip.Content
													className={clsx(styles.tooltip_content, styles.visible)}
													placement="right"
												>
													{link.label}
												</Tooltip.Content>
											</Tooltip>
										) : (
											<Link
												href={link.href === pathname ? '#' : link.href}
												aria-disabled={link.disabled}
												className="w-full"
											>
												<div
													className={clsx(styles.link_button, {
														[styles.active]: micromatch.isMatch(
															pathname,
															`**${link.href}`
														),
														[styles.inactive]: !micromatch.isMatch(
															pathname,
															`**${link.href}`
														),
														[styles.centered]: !isExpanded,
														[styles.left_aligned]: isExpanded,
													})}
												>
													<p className={styles.link_content}>
														{link.icon}
														{isExpanded ? (
															<span className={styles.link_label}>{link.label}</span>
														) : null}
													</p>
												</div>
											</Link>
										)}
									</div>
								) : null
							)}
							<SidebarItemGroupLinks links={groupLinks} isExpanded={isExpanded} />
						</div>
					);
				})}
			</div>
			{/* Серверное время (МСК) */}
			<ServerTimeSection isExpanded={isExpanded} />

			<Separator className="my-2" />

			<div className={styles.footer}>
				<SidebarUserMenu
					isExpanded={isExpanded}
					placement={isExpanded ? 'top' : 'right'}
				/>
			</div>
		</div>
	);
});
