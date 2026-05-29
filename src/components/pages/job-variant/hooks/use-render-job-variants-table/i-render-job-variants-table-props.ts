import { IActionResponse } from '@/types/i-action.types';
import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';

export interface IUseRenderJobVariantsTableProps {
	data: IActionResponse<IJobVariant[]>;
}
