import { IActionResponse } from '@/types/i-action.types';
import { IUnit } from '@/actions/unit/models/unit.schema';

export interface IUseRenderUnitsTableProps {
	data: IActionResponse<IUnit[]>;
}
