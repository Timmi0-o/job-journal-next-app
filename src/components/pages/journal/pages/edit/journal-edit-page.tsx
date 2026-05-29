import { IJournal } from '@/actions/journal/models/journal.schema';
import { JournalEditForm } from '@/components/forms/journal/journal-edit-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const JournalEditPage = ({ data, id }: { data: IJournal; id: string }) => {
	return (
		<BasePage titlePage={`Запись ${data.id.slice(0, 8)}`}>
			<JournalEditForm data={data} id={id} />
		</BasePage>
	);
};
