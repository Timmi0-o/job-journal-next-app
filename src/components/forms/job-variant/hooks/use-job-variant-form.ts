'use client';

import { jobVariantsEdit } from '@/actions/job-variant/actions';
import {
	IJobVariantEdit,
	JobVariantEditSchema,
} from '@/actions/job-variant/models/job-variant-edit.schema';
import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';
import { toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';

export const useJobVariantForm = (id: string) => {
	const router = useRouter();

	const handleSubmit = useCallback(
		async (data: IJobVariant) => {
			const dataToSend: IJobVariantEdit = {
				id,
				name: data.name,
			};

			const validatedData = JobVariantEditSchema.safeParse(dataToSend);

			if (!validatedData.success) {
				return toast.danger('Ошибка в данных', {
					description: validatedData.error.message,
				});
			}

			const { error } = await jobVariantsEdit({
				params: {
					body: validatedData.data,
				},
			});

			if (error?.message) {
				toast.danger('Ошибка', { description: error.message });
				return;
			}

			toast('Вид работы успешно обновлён');
			router.back();
		},
		[id, router]
	);

	return {
		handleSubmit: handleSubmit as SubmitHandler<IJobVariant>,
	};
};
