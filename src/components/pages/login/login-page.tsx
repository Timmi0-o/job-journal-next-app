'use client';

import { ILogin, LoginSchema } from '@/actions/auth/models/auth.model';
import { bindRhfTextField } from '@/utils/rhf-heroui-field.util';
import { Button, Input, Label, Spinner, TextField, toast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const LoginPage = (): React.ReactElement => {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<ILogin>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { email: '', password: '', fingerprint: '' },
	});

	const onSubmit = async (data: ILogin): Promise<void> => {
		setError(null);

		const response = await signIn('baseCredentials', {
			email: data.email,
			password: data.password,
			redirect: false,
		});

		if (response?.error) {
			setError('Неверный email или пароль');
			return;
		}

		toast.success('Добро пожаловать!');
		router.replace('/');
		router.refresh();
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-neutral-950">
			<div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
				<h1 className="mb-6 text-xl font-bold">Журнал работ</h1>

				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState }) => (
							<TextField isRequired isInvalid={!!fieldState.error}>
								<Label>Email</Label>
								<Input
									type="email"
									autoComplete="email"
									placeholder="you@example.com"
									{...bindRhfTextField(field)}
								/>
							</TextField>
						)}
					/>

					<Controller
						name="password"
						control={control}
						render={({ field, fieldState }) => (
							<TextField isRequired isInvalid={!!fieldState.error}>
								<Label>Пароль</Label>
								<Input
									type="password"
									autoComplete="current-password"
									placeholder="••••••••"
									{...bindRhfTextField(field)}
								/>
							</TextField>
						)}
					/>

					{error ? (
						<div className="text-sm text-red-600">{error}</div>
					) : null}

					<Button
						fullWidth
						type="submit"
						variant="primary"
						isPending={isSubmitting}
						isDisabled={isSubmitting}
					>
						{isSubmitting ? <Spinner size="sm" /> : null}
						{isSubmitting ? 'Вход...' : 'Войти'}
					</Button>
				</form>
			</div>
		</div>
	);
};
