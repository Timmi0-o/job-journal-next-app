'use client';

import { Breadcrumbs } from '@heroui/react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import styles from './base-page.module.css';
import { IBasePageProps } from './types/i-base-page-props';

export const BasePage = ({
	children,
	titlePage,
	breadcrumbs,
	headerContent,
	className,
	...props
}: IBasePageProps) => {
	return (
		<div className={clsx(styles.root, className)} {...props}>
			<BasePageHeader
				titlePage={titlePage}
				breadcrumbs={breadcrumbs}
				headerContent={headerContent}
			/>
			<div className={styles.content}>{children}</div>
		</div>
	);
};

const BasePageHeader = ({
	titlePage,
	breadcrumbs,
	headerContent,
}: {
	titlePage?: string | ReactNode;
	breadcrumbs?: { label: string; href: string }[];
	headerContent?: ReactNode;
}) => {
	const pathname = usePathname();
	const hasBreadcrumbs = Boolean(breadcrumbs?.length);
	const hasTitle = Boolean(titlePage);
	const hasHeaderContent = Boolean(headerContent);

	if (!hasBreadcrumbs && !hasTitle && !hasHeaderContent) {
		return null;
	}

	return (
		<div className={styles.header}>
			{/* BREADCRUMBS */}
			{hasBreadcrumbs ? (
				<Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs}>
					{[{ label: 'Главная', href: '/' }, ...(breadcrumbs ?? [])].map((link) => (
						<Breadcrumbs.Item
							aria-current={pathname === link.href ? 'page' : undefined}
							href={pathname === link.href ? '#' : link.href}
							key={link.label}
						>
							{link.label}
						</Breadcrumbs.Item>
					))}
				</Breadcrumbs>
			) : null}

			{/* TITLE + ACTIONS */}
			{hasTitle || hasHeaderContent ? (
				<div className={styles.headerRow}>
					{hasTitle ? (
						<div className={styles.titleWrap}>
							<h1 className={styles.title}>{titlePage}</h1>
						</div>
					) : null}

					{hasHeaderContent ? (
						<div className={styles.headerActions}>{headerContent}</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};
