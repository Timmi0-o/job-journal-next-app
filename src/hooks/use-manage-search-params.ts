'use client';

import { QUERY_ARRAY_SEPARATOR } from '@/constants/query-array-separator';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

enum ENavigationMode {
	BY_REFRESH_SERVER = 'BY_REFRESH_SERVER',
	BY_NO_REFRESH_SERVER = 'BY_NO_REFRESH_SERVER',
}

interface IHandlePushKeyInSearchParamsInterface {
	key: string;
	value: string | null | number | object | undefined | boolean;
}

interface IHandlePushKeyInSearchParamsOptions {
	navigationMode?: keyof typeof ENavigationMode;
}

type IHandlePushKeyInSearchParamsProps =
	| IHandlePushKeyInSearchParamsInterface
	| IHandlePushKeyInSearchParamsInterface[];

interface IUseManageSearchParamsReturn {
	pathname: string;
	searchParams: URLSearchParams;
	handlePushKeyInSearchParams: (
		props: IHandlePushKeyInSearchParamsProps,
		options?: IHandlePushKeyInSearchParamsOptions
	) => void;
	buildQueryValue: (props: IHandlePushKeyInSearchParamsProps) => string;
}

export const useManageSearchParams = (): IUseManageSearchParamsReturn => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const buildQueryValue = (props: IHandlePushKeyInSearchParamsProps): string => {
		const newSearchParams = new URLSearchParams(searchParams.toString());

		const items = Array.isArray(props) ? props : [props];

		items.forEach((paramsItem) => {
			const { key, value } = paramsItem;

			const formattedValue = Array.isArray(value)
				? value.join(QUERY_ARRAY_SEPARATOR)
				: value;

			if (!formattedValue) {
				newSearchParams.delete(key);
			} else {
				newSearchParams.set(key, String(formattedValue));
			}
		});

		return newSearchParams.toString();
	};

	const handlePushKeyInSearchParams = (
		props: IHandlePushKeyInSearchParamsProps,
		options: IHandlePushKeyInSearchParamsOptions = {}
	): void => {
		const queryString = buildQueryValue(props);

		const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
		const currentUrl = `${pathname}${
			searchParams.toString() ? `?${searchParams}` : ''
		}`;

		if (nextUrl === currentUrl) return;

		if (options.navigationMode === ENavigationMode.BY_NO_REFRESH_SERVER) {
			window.history.replaceState(null, '', nextUrl);
			return;
		}

		router.replace(nextUrl, { scroll: false });
	};

	return {
		pathname,
		searchParams,
		handlePushKeyInSearchParams,
		buildQueryValue,
	};
};
