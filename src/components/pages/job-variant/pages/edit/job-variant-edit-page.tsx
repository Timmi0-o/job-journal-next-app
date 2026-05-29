import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';
import { JobVariantEditForm } from '@/components/forms/job-variant/job-variant-edit-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const JobVariantEditPage = ({
	data,
	id,
}: {
	data: IJobVariant;
	id: string;
}) => {
	return (
		<BasePage titlePage={data.name}>
			<JobVariantEditForm data={data} id={id} />
		</BasePage>
	);
};
