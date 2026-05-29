import { IUser } from '@/actions/user/models/user.schema';
import { UserEditForm } from '@/components/forms/user/user-edit-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const UserEditPage = ({ data }: { data: IUser }) => {
	const displayName = [data.surname, data.name].filter(Boolean).join(' ');

	return (
		<BasePage titlePage={displayName || data.email}>
			<UserEditForm data={data} />
		</BasePage>
	);
};
