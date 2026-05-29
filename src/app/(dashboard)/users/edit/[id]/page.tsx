import { userGetOne } from '@/actions/user/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { UserEditPage } from '@/components/pages/user/pages/edit/user-edit-page';
import { notFound } from 'next/navigation';

export default async function UserEdit({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const data = await userGetOne({ id });

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	const user = data.result?.data;
	if (!user) {
		notFound();
	}

	return <UserEditPage data={user} />;
}
