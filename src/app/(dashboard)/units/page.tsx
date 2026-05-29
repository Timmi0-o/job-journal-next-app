import { unitsGet } from '@/actions/unit/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { UnitsPage } from '@/components/pages/unit/unit-page';
import { formatQueryGetUnits } from '@/helpers/format-query-object/format-query-get-units';

export default async function Units({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const searchParamsData = await searchParams;

	const data = await unitsGet({
		filters: formatQueryGetUnits(searchParamsData),
		preset: 'BASE',
	});

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	return <UnitsPage data={data} />;
}
