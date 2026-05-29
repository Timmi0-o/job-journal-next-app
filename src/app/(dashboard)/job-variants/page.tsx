import { jobVariantsGet } from '@/actions/job-variant/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { JobVariantsPage } from '@/components/pages/job-variant/job-variant-page';
import { formatQueryGetJobVariants } from '@/helpers/format-query-object/format-query-get-job-variants';

export default async function JobVariants({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const searchParamsData = await searchParams;

	const data = await jobVariantsGet({
		filters: formatQueryGetJobVariants(searchParamsData),
		preset: 'BASE',
	});

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	return <JobVariantsPage data={data} />;
}
