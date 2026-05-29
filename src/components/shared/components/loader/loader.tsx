'use client';

import { loaderStore } from '@/stores/loader/loader.store';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useReconstructRouterMethods } from './hooks/use-reconts-router-methods';
import styles from './loader.module.css';

export const Loader = observer(({ children }: { children: ReactNode }) => {
	const lineIdRef = useRef(0);
	const replaceIndicatorFrameRef = useRef<number | null>(null);
	const { isLoading } = loaderStore;
	const [activeLineId, setActiveLineId] = useState<number | null>(null);
	const [isReplaceIndicatorMounted, setIsReplaceIndicatorMounted] = useState(false);
	const [isReplaceIndicatorVisible, setIsReplaceIndicatorVisible] = useState(false);
	const [isReplaceIndicatorCompleting, setIsReplaceIndicatorCompleting] =
		useState(false);

	useReconstructRouterMethods();

	const startLoaderLine = useCallback((): void => {
		const nextId = lineIdRef.current + 1;
		lineIdRef.current += 1;
		setActiveLineId(nextId);
	}, []);

	useEffect(() => {
		if (isLoading && activeLineId === null) {
			startLoaderLine();
		}
	}, [activeLineId, isLoading, startLoaderLine]);

	useEffect(() => {
		if (loaderStore.isReplaceLoading) {
			if (replaceIndicatorFrameRef.current) {
				cancelAnimationFrame(replaceIndicatorFrameRef.current);
			}

			setIsReplaceIndicatorMounted(true);
			setIsReplaceIndicatorCompleting(false);

			replaceIndicatorFrameRef.current = requestAnimationFrame(() => {
				setIsReplaceIndicatorVisible(true);
			});

			return;
		}

		if (isReplaceIndicatorMounted) {
			setIsReplaceIndicatorCompleting(true);
		}

		return () => {
			if (replaceIndicatorFrameRef.current) {
				cancelAnimationFrame(replaceIndicatorFrameRef.current);
				replaceIndicatorFrameRef.current = null;
			}
		};
	}, [isReplaceIndicatorMounted, loaderStore.isReplaceLoading]);

	const handleLineAnimationEnd = useCallback((): void => {
		if (loaderStore.isLoading) {
			startLoaderLine();
			return;
		}

		setActiveLineId(null);
	}, [startLoaderLine]);

	const handleReplaceSpinnerIteration = useCallback((): void => {
		if (!loaderStore.isReplaceLoading && isReplaceIndicatorCompleting) {
			setIsReplaceIndicatorVisible(false);
			setIsReplaceIndicatorCompleting(false);
		}
	}, [isReplaceIndicatorCompleting]);

	const handleReplaceIndicatorTransitionEnd = useCallback((): void => {
		if (!isReplaceIndicatorVisible && !loaderStore.isReplaceLoading) {
			setIsReplaceIndicatorMounted(false);
		}
	}, [isReplaceIndicatorVisible]);

	const isLoaderVisible = isLoading || activeLineId !== null;

	return (
		<>
			{isLoaderVisible && (
				<>
					<div
						className={styles.loader}
						role="status"
						aria-live="polite"
						aria-busy={isLoading}
					>
						<div className={styles.loading}>
							{activeLineId !== null && (
								<span
									key={activeLineId}
									className={styles.line}
									onAnimationEnd={handleLineAnimationEnd}
								/>
							)}
						</div>
					</div>

					<div className={clsx(styles.overlay)} />
				</>
			)}

			{isReplaceIndicatorMounted && (
				<div
					className={clsx(styles.replaceIndicator, {
						[styles.replaceIndicatorVisible]: isReplaceIndicatorVisible,
						[styles.replaceIndicatorHidden]: !isReplaceIndicatorVisible,
					})}
					role="status"
					aria-live="polite"
					onTransitionEnd={handleReplaceIndicatorTransitionEnd}
				>
					<div
						className={styles.replaceSpinner}
						aria-hidden="true"
						onAnimationIteration={handleReplaceSpinnerIteration}
					/>
				</div>
			)}

			<div
				className={clsx(styles.content, {
					'opacity-60': isLoaderVisible,
				})}
			>
				{children}
			</div>
		</>
	);
});
