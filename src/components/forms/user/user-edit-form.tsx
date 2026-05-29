'use client';

import { IUserEdit, UserEditSchema } from '@/actions/user/models/user-edit.schema';
import { IUser } from '@/actions/user/models/user.schema';
import { FormTabs } from '@/components/forms/ui/form-tabs/form-tabs';
import { useManageSearchParams } from '@/hooks/use-manage-search-params';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MainInfoTab } from './components/tabs/main-info-tab/main-info-tab';

interface IUserEditFormProps {
	data: IUser;
}

export const UserEditForm = ({ data }: IUserEditFormProps): React.ReactElement => {
	const { searchParams, handlePushKeyInSearchParams } = useManageSearchParams();
	const initialTab = searchParams.get('tab');
	const [tab, setTab] = useState<string | null>(initialTab);

	const userForm = useForm<IUserEdit>({
		resolver: zodResolver(UserEditSchema),
		defaultValues: {
			id: data.id,
			surname: data.surname,
			name: data.name,
			patronymic: data.patronymic ?? null,
			email: data.email,
			phone: data.phone ?? null,
			role: data.role,
			status: data.status,
		},
	});

	const handleTabChange = (tabKey: string): void => {
		setTab(tabKey);
		handlePushKeyInSearchParams(
			{ key: 'tab', value: tabKey },
			{ navigationMode: 'BY_NO_REFRESH_SERVER' }
		);
	};

	const tabs = [
		{
			name: 'Главная информация',
			key: 'main',
			component: (
				<FormProvider {...userForm}>
					<MainInfoTab email={data.email} id={data.id} />
				</FormProvider>
			),
			isDisabled: false,
		},
	];

	return <FormTabs activeTab={tab} setActiveTab={handleTabChange} tabs={tabs} />;
};
