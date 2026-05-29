'use client';

import { unitsEdit } from '@/actions/unit/actions';
import {
	IUnitEdit,
	UnitEditSchema,
} from '@/actions/unit/models/unit-edit.schema';
import { IUnit } from '@/actions/unit/models/unit.schema';
import { toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';

export const useUnitForm = (id: string) => {
	const router = useRouter();

	const handleSubmit = useCallback(
		async (data: IUnit) => {
			const dataToSend: IUnitEdit = {
				id,
				name: data.name,
			};

			const validatedData = UnitEditSchema.safeParse(dataToSend);

			if (!validatedData.success) {
				return toast.danger('Ошибка в данных', {
					description: validatedData.error.message,
				});
			}

			const { error } = await unitsEdit({
				params: {
					body: validatedData.data,
				},
			});

			if (error?.message) {
				toast.danger('Ошибка', { description: error.message });
				return;
			}

			toast('Единица измерения успешно обновлена');
			router.back();
		},
		[id, router]
	);

	return {
		handleSubmit: handleSubmit as SubmitHandler<IUnit>,
	};
};
