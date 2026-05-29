import { jobVariantGetOne } from '@/actions/job-variant/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { JobVariantEditPage } from '@/components/pages/job-variant/pages/edit/job-variant-edit-page';
import { notFound } from 'next/navigation';

export default async function JobVariantEdit({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const data = await jobVariantGetOne({ id });

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	const jobVariant = data.result?.data;
	if (!jobVariant) {
		notFound();
	}

	return <JobVariantEditPage data={jobVariant} id={id} />;
}
