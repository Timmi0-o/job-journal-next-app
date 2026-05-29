'use client';

import { Button, Popover } from '@heroui/react';
import clsx from 'clsx';
import micromatch from 'micromatch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { ISidebarLink } from '../../data/links/types/i-sidebar-link';
import styles from './sidebar-item-group-links.module.css';
import { buildHref, getInitialOpenKeys } from './utils/link-keys-formatters.utils';

export const SidebarItemGroupLinks = ({
	links,
	isExpanded,
}: {
	links: ISidebarLink[];
	isExpanded: boolean;
}) => {
	const pathname = usePathname();

	const initialOpen = useMemo(
		() => getInitialOpenKeys(links, pathname),
		[links, pathname]
	);

	const [openKeys, setOpenKeys] = useState<Set<string>>(initialOpen);

	const toggle = (key: string) => {
		setOpenKeys((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	};

	if (!isExpanded) {
		return (
			<div className={styles.collapsedGroups}>
				{links.map((link) => {
					const isActive =
						micromatch.isMatch(pathname, `/${link.prefix}/**`) ||
						link.items?.some((item) => {
							if (item.items)
								return item.items.some((sub) =>
									micromatch.isMatch(pathname, `**${sub.href}`)
								);
							return micromatch.isMatch(pathname, `**${item.href}`);
						}) ||
						false;

					return (
						<div key={link.label} className={styles.popoverTriggerWrapper}>
							<Popover>
								<Button
									className={clsx(styles.popoverTrigger, {
										[styles.popoverTriggerActive]: isActive,
										[styles.popoverTriggerInactive]: !isActive,
									})}
									isIconOnly
									variant="ghost"
									size="sm"
								>
									<span className={styles.popoverTriggerInner}>
										<span
											className={clsx(
												styles.iconWithChevron,
												styles.iconWithChevronCollapsed
											)}
										>
											{link.icon}
											<IoIosArrowDown size={12} />
										</span>
									</span>
								</Button>
								<Popover.Content
									placement="right"
									offset={15}
									className={styles.popoverContent}
								>
									<Popover.Dialog className="outline-none flex flex-col gap-0.5">
										{link.items?.map((subPopoverItem: ISidebarLink, si: number) => {
											const subIsActive = subPopoverItem.items?.some(
												(item) =>
													pathname.includes(item.href || '') ||
													pathname.endsWith(item.href || '')
											);

											return subPopoverItem.items?.length ? (
												<Popover key={`${subPopoverItem.label}-${si}`}>
													<Button
														className={clsx(styles.popoverButton, {
															'justify-start w-full': true,
															[styles.popoverButtonActive]: subIsActive,
															[styles.popoverButtonInactive]: !subIsActive,
														})}
														variant="ghost"
														size="sm"
														fullWidth
													>
														<span className="flex items-center gap-2 w-full">
															{subPopoverItem.icon}
															<span className="text-sm text-left">
																{subPopoverItem.label}
															</span>
															<IoIosArrowDown size={12} className="ml-auto" />
														</span>
													</Button>
													<Popover.Content
														placement="right"
														offset={5}
														className={styles.popoverContent}
													>
														<Popover.Dialog className="outline-none">
															{subPopoverItem.items?.map(
																(item: ISidebarLink, index: number) => (
																	<Link
																		key={`${item.label}-${index}`}
																		href={
																			item.href === pathname
																				? '#'
																				: buildHref(subPopoverItem.prefix, item.href)
																		}
																		aria-disabled={item.disabled}
																		className={clsx(
																			styles.popoverButton,
																			'justify-start w-full flex',
																			{
																				[styles.popoverButtonActive]:
																					micromatch.isMatch(
																						pathname,
																						`**${item.href}`
																					),
																				[styles.popoverButtonInactive]:
																					!micromatch.isMatch(
																						pathname,
																						`**${item.href}`
																					),
																			}
																		)}
																	>
																		<span className="flex items-center gap-2 w-full">
																			{item.icon}
																			<span className="text-sm text-left">
																				{item.label}
																			</span>
																		</span>
																	</Link>
																)
															)}
														</Popover.Dialog>
													</Popover.Content>
												</Popover>
											) : (
												<Link
													key={`${subPopoverItem.label}-${si}`}
													href={
														subPopoverItem.href === pathname
															? '#'
															: buildHref(link.prefix, subPopoverItem.href)
													}
													aria-disabled={subPopoverItem.disabled}
													className={clsx(
														styles.popoverButton,
														'justify-start w-full flex',
														{
															[styles.popoverButtonActive]: micromatch.isMatch(
																pathname,
																`**${subPopoverItem.href}`
															),
															[styles.popoverButtonInactive]: !micromatch.isMatch(
																pathname,
																`**${subPopoverItem.href}`
															),
														}
													)}
												>
													<span className="flex items-center gap-2 w-full">
														{subPopoverItem.icon}
														<span className="text-sm text-left">
															{subPopoverItem.label}
														</span>
													</span>
												</Link>
											);
										})}
									</Popover.Dialog>
								</Popover.Content>
							</Popover>
						</div>
					);
				})}
			</div>
		);
	}

	// Expanded: custom compact collapsible (no Accordion)
	return (
		<>
			{links.map((link) => {
				const groupKey = link.label;
				const isOpen = openKeys.has(groupKey);
				const isActive =
					micromatch.isMatch(pathname, `/${link.prefix}/**`) ||
					link.items?.some((item) => {
						if (item.items)
							return item.items.some((sub) =>
								micromatch.isMatch(pathname, `**${sub.href}`)
							);
						return micromatch.isMatch(pathname, `**${item.href}`);
					}) ||
					false;

				return (
					<div key={groupKey} className={styles.group}>
						<button
							type="button"
							aria-expanded={isOpen}
							className={clsx(styles.groupTrigger, {
								[styles.titleWrapperActive]: isActive,
								[styles.titleWrapperInactive]: !isActive,
							})}
							onClick={() => toggle(groupKey)}
						>
							<span className={styles.groupTriggerContent}>
								{link.icon}
								<span className={styles.groupLabel}>{link.label}</span>
							</span>
							<span className={clsx(styles.chevron, isOpen && styles.chevronOpen)}>
								<IoIosArrowDown size={12} />
							</span>
						</button>
						{link.items && (
							<div
								className={clsx(styles.collapsePanel, {
									[styles.collapsePanelOpen]: isOpen,
								})}
							>
								<div className={styles.collapsePanelInner}>
									<div className={styles.groupChildren}>
								{link.items.map((sub: ISidebarLink, si: number) => {
									const nestedKey = `${groupKey}::${sub.label}`;
									const hasNested = Boolean(sub.items?.length);
									const isNestedOpen = openKeys.has(nestedKey);
									const isNestedActive =
										(micromatch.isMatch(pathname, `/${sub.prefix}/**`) ||
											sub.items?.some((item) =>
												micromatch.isMatch(pathname, `**${item.href}`)
											)) ??
										false;

									if (hasNested) {
										return (
											<div key={nestedKey} className={styles.nestedGroup}>
												<button
													type="button"
													aria-expanded={isNestedOpen}
													className={clsx(styles.nestedTrigger, {
														[styles.buttonActive]: isNestedActive,
														[styles.buttonInactive]: !isNestedActive,
													})}
													onClick={() => toggle(nestedKey)}
												>
													<span className={styles.nestedTriggerContent}>
														{sub.icon}
														<span className={styles.buttonSmall}>{sub.label}</span>
													</span>
													<span
														className={clsx(
															styles.chevron,
															isNestedOpen && styles.chevronOpen
														)}
													>
														<IoIosArrowDown size={12} />
													</span>
												</button>
												{sub.items && (
													<div
														className={clsx(styles.collapsePanel, {
															[styles.collapsePanelOpen]: isNestedOpen,
														})}
													>
														<div className={styles.collapsePanelInner}>
															<div className={styles.nestedChildren}>
														{sub.items.map((item: ISidebarLink, idx: number) => (
															<Link
																key={`${item.label}-${idx}`}
																href={
																	item.href === pathname
																		? '#'
																		: buildHref(sub.prefix, item.href)
																}
																aria-disabled={item.disabled}
																className={clsx(styles.button, 'flex w-full', {
																	[styles.buttonActive]: micromatch.isMatch(
																		pathname,
																		`**${item.href}`
																	),
																	[styles.buttonInactive]: !micromatch.isMatch(
																		pathname,
																		`**${item.href}`
																	),
																})}
															>
																<span className="flex items-center gap-2">
																	{item.icon}
																	<span className={styles.buttonSmall}>
																		{item.label}
																	</span>
																</span>
															</Link>
														))}
															</div>
														</div>
													</div>
												)}
											</div>
										);
									}

									return (
										<Link
											key={`${sub.label}-${si}`}
											href={
												sub.href === pathname
													? '#'
													: buildHref(link.prefix, sub.href)
											}
											aria-disabled={sub.disabled}
										>
											<div
												className={clsx(styles.button, 'flex w-full', {
													[styles.buttonActive]: micromatch.isMatch(
														pathname,
														`**${sub.href}`
													),
													[styles.buttonInactive]: !micromatch.isMatch(
														pathname,
														`**${sub.href}`
													),
												})}
											>
												<span className="flex items-center gap-2">
													{sub.icon}
													<span className={styles.buttonSmall}>{sub.label}</span>
												</span>
											</div>
										</Link>
									);
								})}
									</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</>
	);
};
