import { journalsGet } from '@/actions/journal/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { JournalsPage } from '@/components/pages/journal/journal-page';
import { formatQueryGetJournals } from '@/helpers/format-query-object/format-query-get-journals';

export default async function Journals({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const searchParamsData = await searchParams;

	const data = await journalsGet({
		filters: formatQueryGetJournals(searchParamsData),
		preset: 'BASE',
	});

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	return <JournalsPage data={data} />;
}
