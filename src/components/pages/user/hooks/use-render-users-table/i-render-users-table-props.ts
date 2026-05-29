import { IActionResponse } from '@/types/i-action.types';
import { IUser } from '@/actions/user/models/user.schema';

export interface IUseRenderUsersTableProps {
	data: IActionResponse<IUser[]>;
}
