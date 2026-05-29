'use client';

import {
	unitGetOne,
	unitsCreate,
	unitsDelete,
	unitsEdit,
	unitsGet,
} from '@/actions/unit/actions';
import { IUnit } from '@/actions/unit/models/unit.schema';
import { IUnitCreate } from '@/actions/unit/models/unit-create.schema';
import { IUnitEdit } from '@/actions/unit/models/unit-edit.schema';
import { createEntityHooks } from '../create-entity-hooks';

export const {
	useGetList: useUnits,
	useGetOne: useUnit,
	useCreate: useCreateUnit,
	useUpdate: useUpdateUnit,
	useDelete: useDeleteUnit,
} = createEntityHooks<IUnit, IUnitCreate, IUnitEdit>(
	'unit',
	{
		getList: unitsGet,
		getOne: unitGetOne,
		create: unitsCreate,
		edit: unitsEdit,
		remove: unitsDelete,
	},
	{
		created: 'Единица измерения создана',
		updated: 'Единица измерения обновлена',
		deleted: 'Единица измерения удалена',
		error: 'Ошибка',
	}
);
