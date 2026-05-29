'use client';

import { userGetOne } from '@/actions/user/actions';
import { IUser } from '@/actions/user/models/user.schema';
import { IGetActionPresets } from '@/types/i-action.types';
import { useQuery } from '@tanstack/react-query';

interface IUseGetUserProps {
	userId: string | null | undefined;
	preset?: IGetActionPresets;
}

export const useGetUser = ({ userId, preset }: IUseGetUserProps) => {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['user', userId],
		queryFn: async () => {
			const response = await userGetOne({ id: userId!, preset });

			if (response.result) {
				const result = response.result as { data?: IUser } | IUser;
				if ('data' in result && result.data) {
					return result.data;
				}
				return result as IUser;
			}

			return null;
		},
		enabled: !!userId && userId !== '',
	});

	return {
		data,
		isLoading,
		refresh: refetch,
	};
};
