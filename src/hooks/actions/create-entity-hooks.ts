'use client';

import {
	IActionResponse,
	IGetActionOptions,
	IMutateActionOptions,
} from '@/types/i-action.types';
import { toast } from '@heroui/react';
import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

type IGetListAction<TEntity> = (
	opts: Partial<IGetActionOptions>
) => Promise<IActionResponse<TEntity[]>>;

type IGetOneAction<TEntity> = (
	opts: Partial<IGetActionOptions>
) => Promise<IActionResponse<TEntity>>;

type ICreateAction<TEntity, TCreate> = (
	opts: Partial<IMutateActionOptions<TCreate>>
) => Promise<IActionResponse<TEntity>>;

type IEditAction<TEntity, TEdit> = (
	opts: Partial<IMutateActionOptions<TEdit>>
) => Promise<IActionResponse<boolean | TEntity>>;

type IDeleteAction = (
	opts: { id: string } & Partial<IMutateActionOptions<undefined>>
) => Promise<IActionResponse<boolean>>;

interface IEntityActions<TEntity, TCreate, TEdit> {
	getList: IGetListAction<TEntity>;
	getOne: IGetOneAction<TEntity>;
	create: ICreateAction<TEntity, TCreate>;
	edit: IEditAction<TEntity, TEdit>;
	remove: IDeleteAction;
}

interface IEntityLabels {
	created: string;
	updated: string;
	deleted: string;
	error: string;
}

const unwrapError = (response: { error?: { message: string } }): void => {
	if (response.error) {
		throw new Error(response.error.message);
	}
};

export const createEntityHooks = <TEntity, TCreate, TEdit extends { id: string }>(
	entityKey: string,
	actions: IEntityActions<TEntity, TCreate, TEdit>,
	labels: IEntityLabels
) => {
	const listKey = (filters?: unknown): unknown[] => [entityKey, 'list', filters];
	const oneKey = (id: string): unknown[] => [entityKey, 'one', id];

	const useGetList = (filters?: Partial<IGetActionOptions>) => {
		const { data, isLoading, refetch } = useQuery({
			queryKey: listKey(filters),
			queryFn: async () => {
				const response = await actions.getList(filters ?? {});
				return response.result?.data ?? [];
			},
		});

		return { data: data ?? [], isLoading, refresh: refetch };
	};

	const useGetOne = (id: string | undefined) => {
		const { data, isLoading, refetch } = useQuery({
			queryKey: oneKey(id ?? ''),
			queryFn: async () => {
				const response = await actions.getOne({ id: id! });
				return response.result?.data ?? null;
			},
			enabled: Boolean(id),
		});

		return { data: data ?? null, isLoading, refresh: refetch };
	};

	const useCreate = () => {
		const queryClient = useQueryClient();

		const { mutateAsync, isPending } = useMutation({
			mutationFn: async (body: TCreate) => {
				const response = await actions.create({ params: { body } });
				unwrapError(response);
				return response;
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: [entityKey] });
				toast.success(labels.created);
			},
			onError: (error: unknown) => {
				toast.danger(labels.error, {
					description: error instanceof Error ? error.message : undefined,
				});
			},
		});

		return { create: mutateAsync, isPending };
	};

	const useUpdate = () => {
		const queryClient = useQueryClient();

		const { mutateAsync, isPending } = useMutation({
			mutationFn: async (body: TEdit) => {
				const response = await actions.edit({ params: { body } });
				unwrapError(response);
				return response;
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: [entityKey] });
				toast.success(labels.updated);
			},
			onError: (error: unknown) => {
				toast.danger(labels.error, {
					description: error instanceof Error ? error.message : undefined,
				});
			},
		});

		return { update: mutateAsync, isPending };
	};

	const useDelete = () => {
		const queryClient = useQueryClient();

		const { mutateAsync, isPending } = useMutation({
			mutationFn: async (id: string) => {
				const response = await actions.remove({ id });
				unwrapError(response);
				return response;
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: [entityKey] });
				toast.success(labels.deleted);
			},
			onError: (error: unknown) => {
				toast.danger(labels.error, {
					description: error instanceof Error ? error.message : undefined,
				});
			},
		});

		return { remove: mutateAsync, isPending };
	};

	return { useGetList, useGetOne, useCreate, useUpdate, useDelete };
};
