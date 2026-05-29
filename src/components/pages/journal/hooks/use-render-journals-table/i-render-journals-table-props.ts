import { IActionResponse } from '@/types/i-action.types';
import { IJournal } from '@/actions/journal/models/journal.schema';

export interface IUseRenderJournalsTableProps {
	data: IActionResponse<IJournal[]>;
}
