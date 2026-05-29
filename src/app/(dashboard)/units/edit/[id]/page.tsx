import { unitGetOne } from '@/actions/unit/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { UnitEditPage } from '@/components/pages/unit/pages/edit/unit-edit-page';
import { notFound } from 'next/navigation';

export default async function UnitEdit({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const data = await unitGetOne({ id });

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	const unit = data.result?.data;
	if (!unit) {
		notFound();
	}

	return <UnitEditPage data={unit} id={id} />;
}
