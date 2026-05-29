'use client'

import { usersCreate } from '@/actions/user/actions'
import {
	IUserCreate,
	UserCreateSchema,
} from '@/actions/user/models/user-create.schema'
import { FormActionBar } from '@/components/forms/components/action-bars/form-action-bar'
import { BaseForm } from '@/components/forms/components/base-form/base-form'
import { FormTabs } from '@/components/forms/ui/form-tabs/form-tabs'
import {
	EUserRole,
	EUserStatus,
	USER_ROLE_LABELS,
	USER_STATUS_LABELS,
} from '@/enums/user.enum'
import { bindRhfNullableTextField, bindRhfTextField } from '@/utils/rhf-heroui-field.util'
import {
	FieldError,
	Input,
	Label,
	ListBox,
	Select,
	TextField,
	toast,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'

export const UserCreateForm = () => {
	const router = useRouter()

	const userForm = useForm<IUserCreate>({
		resolver: zodResolver(UserCreateSchema),
		defaultValues: {
			surname: '',
			name: '',
			patronymic: null,
			email: '',
			phone: null,
			status: EUserStatus.ACTIVE,
			role: EUserRole.USER,
			password: '',
		},
	})

	const {
		control,
		formState: { errors, isSubmitting, isDirty },
	} = userForm

	const onSubmit = async (data: IUserCreate) => {
		const validatedData = UserCreateSchema.safeParse(data)

		if (!validatedData.success) {
			return toast.danger('Ошибка в данных', {
				description: validatedData.error.message,
			})
		}

		const res = await usersCreate({
			params: {
				body: validatedData.data,
			},
		})

		if (res?.error) {
			return toast.danger('Ошибка', { description: res.error.message })
		}

		toast('Пользователь успешно создан')
		router.back()
	}

	const tabs = useMemo(
		() => [
			{
				name: 'Главная информация',
				key: 'main',
				component: (
					<div className='flex flex-col gap-4 flex-1 w-full'>
						{[
							{
								key: 'names-group',
								items: [
									{
										key: 'surname',
										render: (
											<Controller
												name='surname'
												control={control}
												render={({ field }) => (
													<TextField isInvalid={!!errors.surname}>
														<Label>Фамилия</Label>
														<Input
															placeholder='Фамилия'
															{...bindRhfTextField(field)}
														/>
														<FieldError>{errors.surname?.message}</FieldError>
													</TextField>
												)}
											/>
										),
									},
									{
										key: 'name',
										render: (
											<Controller
												name='name'
												control={control}
												render={({ field }) => (
													<TextField isInvalid={!!errors.name}>
														<Label>Имя</Label>
														<Input
															placeholder='Имя'
															{...bindRhfTextField(field)}
														/>
														<FieldError>{errors.name?.message}</FieldError>
													</TextField>
												)}
											/>
										),
									},
									{
										key: 'patronymic',
										render: (
											<Controller
												name='patronymic'
												control={control}
												render={({ field }) => (
													<TextField>
														<Label>Отчество</Label>
														<Input
															placeholder='Отчество'
															{...bindRhfNullableTextField(field)}
														/>
														<FieldError>
															{errors.patronymic?.message}
														</FieldError>
													</TextField>
												)}
											/>
										),
									},
								],
							},
							{
								key: 'contacts-group',
								items: [
									{
										key: 'email',
										render: (
											<Controller
												name='email'
												control={control}
												render={({ field }) => (
													<TextField isInvalid={!!errors.email}>
														<Label>Email</Label>
														<Input
															type='email'
															placeholder='Email'
															{...bindRhfTextField(field)}
														/>
														<FieldError>{errors.email?.message}</FieldError>
													</TextField>
												)}
											/>
										),
									},
									{
										key: 'phone',
										render: (
											<Controller
												name='phone'
												control={control}
												render={({ field }) => (
													<TextField>
														<Label>Телефон</Label>
														<Input
															placeholder='Телефон'
															{...bindRhfNullableTextField(field)}
														/>
														<FieldError>{errors.phone?.message}</FieldError>
													</TextField>
												)}
											/>
										),
									},
								],
							},
							{
								key: 'access-group',
								items: [
									{
										key: 'password',
										render: (
											<Controller
												name='password'
												control={control}
												render={({ field }) => (
													<TextField isInvalid={!!errors.password}>
														<Label>Пароль</Label>
														<Input
															type='password'
															placeholder='Пароль'
															{...bindRhfTextField(field)}
														/>
														<FieldError>
															{errors.password?.message}
														</FieldError>
													</TextField>
												)}
											/>
										),
									},
									{
										key: 'role',
										render: (
											<Controller
												name='role'
												control={control}
												render={({ field }) => (
													<Select
														className='w-full'
														name={field.name}
														isInvalid={!!errors.role}
														value={
															field.value != null ? String(field.value) : null
														}
														onChange={(key) => {
															if (key == null) return
															field.onChange(String(key) as EUserRole)
														}}
														onBlur={field.onBlur}
													>
														<Label>Роль</Label>
														<Select.Trigger>
															<Select.Value />
															<Select.Indicator />
														</Select.Trigger>
														<Select.Popover>
															<ListBox>
																{Object.values(EUserRole).map((role) => (
																	<ListBox.Item
																		key={role}
																		id={role}
																		textValue={USER_ROLE_LABELS[role]}
																	>
																		{USER_ROLE_LABELS[role]}
																		<ListBox.ItemIndicator />
																	</ListBox.Item>
																))}
															</ListBox>
														</Select.Popover>
														<FieldError>{errors.role?.message}</FieldError>
													</Select>
												)}
											/>
										),
									},
									{
										key: 'status',
										render: (
											<Controller
												name='status'
												control={control}
												render={({ field }) => (
													<Select
														className='w-full'
														name={field.name}
														isInvalid={!!errors.status}
														value={
															field.value != null ? String(field.value) : null
														}
														onChange={(key) => {
															if (key == null) return
															field.onChange(String(key) as EUserStatus)
														}}
														onBlur={field.onBlur}
													>
														<Label>Статус</Label>
														<Select.Trigger>
															<Select.Value />
															<Select.Indicator />
														</Select.Trigger>
														<Select.Popover>
															<ListBox>
																{Object.values(EUserStatus).map((status) => (
																	<ListBox.Item
																		key={status}
																		id={status}
																		textValue={USER_STATUS_LABELS[status]}
																	>
																		{USER_STATUS_LABELS[status]}
																		<ListBox.ItemIndicator />
																	</ListBox.Item>
																))}
															</ListBox>
														</Select.Popover>
														<FieldError>{errors.status?.message}</FieldError>
													</Select>
												)}
											/>
										),
									},
								],
							},
						].map((field) => (
							<div
								className='flex items-start gap-2 flex-wrap w-full'
								key={field.key}
							>
								{field.items.map((item) => (
									<div className='flex-1' key={item.key}>
										{item.render}
									</div>
								))}
							</div>
						))}
					</div>
				),
			},
		],
		[control, errors],
	)

	return (
		<FormProvider {...userForm}>
			<BaseForm id='user-create-form' className='flex-row' onSubmit={onSubmit}>
				<FormTabs tabs={tabs} />
				<FormActionBar
					primaryIcon={<FaSave />}
					hintText='Проверьте данные и нажмите Сохранить'
					isDisabled={!isDirty}
					secondaryAction={{
						label: 'Назад',
						onClick: () => router.back(),
					}}
				/>
			</BaseForm>
		</FormProvider>
	)
}
