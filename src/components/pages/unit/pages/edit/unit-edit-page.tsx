import { IUnit } from '@/actions/unit/models/unit.schema';
import { UnitEditForm } from '@/components/forms/unit/unit-edit-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const UnitEditPage = ({ data, id }: { data: IUnit; id: string }) => {
	return (
		<BasePage titlePage={data.name}>
			<UnitEditForm data={data} id={id} />
		</BasePage>
	);
};
