import { journalGetOne } from '@/actions/journal/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { JournalEditPage } from '@/components/pages/journal/pages/edit/journal-edit-page';
import { notFound } from 'next/navigation';

export default async function JournalEdit({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const data = await journalGetOne({ id });

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	const journal = data.result?.data;
	if (!journal) {
		notFound();
	}

	return <JournalEditPage data={journal} id={id} />;
}
