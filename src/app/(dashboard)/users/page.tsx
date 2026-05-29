import { usersGet } from '@/actions/user/actions';
import { ErrorPage } from '@/components/pages/error/error-page';
import { UsersPage } from '@/components/pages/user/user-page';
import { formatQueryGetUsers } from '@/helpers/format-query-object/format-query-get-users';

export default async function Users({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const searchParamsData = await searchParams;

	const data = await usersGet({
		filters: formatQueryGetUsers(searchParamsData),
		preset: 'BASE',
	});

	if (data.error) {
		return <ErrorPage errors={[data.error]} />;
	}

	return <UsersPage data={data} />;
}
