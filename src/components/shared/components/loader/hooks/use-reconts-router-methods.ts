'use client';

import { loaderStore } from '@/stores/loader/loader.store';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const useReconstructRouterMethods = () => {
	const { isLoading, setIsLoading } = loaderStore;
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const handleClick = (e: MouseEvent): void => {
			const target = e.target as HTMLElement;
			const link = target.closest('a');

			if (link && link.href) {
				const linkUrl = new URL(link.href);
				const currentUrl = new URL(window.location.href);

				const isInternalLink = linkUrl.origin === currentUrl.origin;
				const isNotDifferentPath =
					linkUrl.pathname.replaceAll('/', '') !==
					currentUrl.pathname.replaceAll('/', '');

				if (isInternalLink && isNotDifferentPath) {
					setIsLoading(true);
				}
			}
		};

		window.addEventListener('click', handleClick, true);
		return () => {
			window.removeEventListener('click', handleClick, true);
		};
	}, [searchParams, pathname]);

	useEffect(() => {
		const originalPush = router.push;
		const originalReplace = router.replace;
		const originalBack = router.back;
		const originalForward = router.forward;

		//eslint-disable-next-line
		router.push = (href: string, options?: unknown): unknown => {
			const newSearchParams = new URLSearchParams(searchParams.toString());

			const originalPathname = `${pathname.replaceAll('/', '')}${
				newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
			}`;

			const newPathname = href.replaceAll('/', '');

			const isNotDifferentPath =
				newPathname !== originalPathname && newPathname !== '#';

			if (isNotDifferentPath) {
				setIsLoading(true);
				return originalPush(href, options as NavigateOptions);
			}
		};

		router.replace = (href: string, options?: unknown): unknown => {
			const newSearchParams = new URLSearchParams(searchParams.toString());

			const isNotDifferentPath =
				href.replaceAll('/', '') !==
				`${pathname.replaceAll('/', '')}${
					newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
				}`;

			if (isNotDifferentPath) {
				loaderStore.setIsReplaceLoading(true);
				return originalReplace(href, options as NavigateOptions);
			}
		};

		router.back = () => {
			setIsLoading(true);
			return originalBack();
		};

		router.forward = () => {
			setIsLoading(true);
			return originalForward();
		};

		return () => {
			router.push = originalPush;
			router.replace = originalReplace;
			router.back = originalBack;
			router.forward = originalForward;
		};
	}, [router, pathname, searchParams]);

	useEffect(() => {
		if (isLoading) {
			setIsLoading(false);
		}
		loaderStore.setIsReplaceLoading(false);
	}, [searchParams, router, pathname]);
};
