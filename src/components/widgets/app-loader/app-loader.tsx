'use client';

import { useKeyDownAction } from '@/hooks/use-key-down-action';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { LuClipboardList } from 'react-icons/lu';
import styles from './app-loader.module.css';

let hasAuthResolvedOnce = false;
const markAuthResolved = (): void => {
	hasAuthResolvedOnce = true;
};

export const AppLoader = () => {
	const session = useSession();

	const isInitialAuthLoading = session.status === 'loading' && !hasAuthResolvedOnce;

	const [isFullLoaderVisible, setFullLoaderVisible] = useState(isInitialAuthLoading);
	const [isRefreshOverlayVisible, setRefreshOverlayVisible] = useState(false);

	useEffect(() => {
		if (session.status !== 'loading') {
			markAuthResolved();
		}
	}, [session.status]);

	useEffect(() => {
		if (isInitialAuthLoading && !isRefreshOverlayVisible) {
			requestAnimationFrame(() => setFullLoaderVisible(true));
			return;
		}

		requestAnimationFrame(() => setTimeout(() => setFullLoaderVisible(false), 250));
	}, [isInitialAuthLoading, isRefreshOverlayVisible]);

	useKeyDownAction([
		{
			key: 'F5',
			action: () =>
				setTimeout(
					() => requestAnimationFrame(() => setRefreshOverlayVisible(true)),
					250
				),
		},
		{
			key: ['r', 'R'],
			ctrlKey: true,
			action: () =>
				setTimeout(
					() => requestAnimationFrame(() => setRefreshOverlayVisible(true)),
					250
				),
		},
		{
			key: ['r', 'R'],
			metaKey: true,
			action: () =>
				setTimeout(
					() => requestAnimationFrame(() => setRefreshOverlayVisible(true)),
					250
				),
		},
	]);

	useEffect(() => {
		const onBeforeUnload = () => {
			requestAnimationFrame(() => setRefreshOverlayVisible(true));
		};

		window.addEventListener('beforeunload', onBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', onBeforeUnload);
		};
	}, []);

	const isOverlayShown = isFullLoaderVisible || isRefreshOverlayVisible;
	const isRefreshDimOnly = isRefreshOverlayVisible && !isFullLoaderVisible;

	return (
		<div
			className={clsx(styles.loadingWrapper, {
				[styles.isVisible]: isOverlayShown,
				[styles.hidden]: !isOverlayShown,
				[styles.refreshDimOnly]: isRefreshDimOnly,
			})}
			role="status"
			aria-live="polite"
			aria-busy={isOverlayShown}
		>
			{/* AMBIENT BACKGROUND */}
			<div className={styles.bgOrb} aria-hidden="true" />

			{/* CENTER CONTENT */}
			<div className={styles.loaderContent}>
				{/* LOGO */}
				<div className={styles.logoWrap}>
					<div className={styles.logoRing} aria-hidden="true" />
					<div className={styles.logoIcon} aria-hidden="true">
						<LuClipboardList size={36} />
					</div>
				</div>

				{/* BRAND */}
				<div className={styles.brand}>
					<span className={styles.brandTitle}>Журнал работ</span>
					<span className={styles.brandSubtitle}>Учёт выполненных работ</span>
				</div>

				{/* LOADING DOTS */}
				<div className={styles.dots} aria-hidden="true">
					<span />
					<span />
					<span />
				</div>
			</div>

			{/* PROGRESS BAR */}
			<div className={styles.progressBar} aria-hidden="true">
				<div className={styles.progressFill} />
			</div>

			<span className={styles.srOnly}>
				{isRefreshDimOnly ? 'Обновление страницы' : 'Загрузка приложения'}
			</span>
		</div>
	);
};
