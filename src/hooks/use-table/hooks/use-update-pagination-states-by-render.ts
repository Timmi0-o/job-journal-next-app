'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';

export const useUpdatePaginationStatesByRender = ({
	rowsPerPage,
	isChangeQueryUrl,
	setRowsPerPage,
	setPage,
}: {
	rowsPerPage: number | string;
	isChangeQueryUrl: boolean;
	setRowsPerPage: Dispatch<SetStateAction<string>>;
	setPage: Dispatch<SetStateAction<number>>;
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const pageParam = searchParams.get('page');
		const limit = searchParams.get('limit');

		const newSearchParams = new URLSearchParams(searchParams.toString());

		if (pageParam !== null && pageParam !== '' && Number(pageParam) >= 1) {
			setPage(Number(pageParam));
		} else {
			setPage(1);
		}

		if (limit) {
			setRowsPerPage(limit);
		} else {
			newSearchParams.set('limit', String(rowsPerPage));
		}

		const newQueryString = newSearchParams.toString();
		const isUrlChanged = newQueryString !== searchParams.toString();

		if (isChangeQueryUrl && isUrlChanged) {
			router.replace(`${pathname}?${newQueryString}`);
		}
	}, [searchParams.toString()]);
};
