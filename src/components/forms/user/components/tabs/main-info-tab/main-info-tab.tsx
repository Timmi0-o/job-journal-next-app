'use client';

import { IUserEdit } from '@/actions/user/models/user-edit.schema';
import { FormActionBar } from '@/components/forms/components/action-bars/form-action-bar';
import { BaseForm } from '@/components/forms/components/base-form/base-form';
import { EUserRole, EUserStatus, USER_ROLE_LABELS, USER_STATUS_LABELS } from '@/enums/user.enum';
import { bindRhfNullableTextField, bindRhfTextField } from '@/utils/rhf-heroui-field.util';
import {
	FieldError,
	Input,
	Label,
	ListBox,
	Select,
	TextField,
} from '@heroui/react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import { useOnSubmitUserEditForm } from '../../../hooks/use-on-submit-user-edit-form';

interface IMainInfoTabProps {
	email: string;
	id: string;
}

export const MainInfoTab = ({ email, id }: IMainInfoTabProps) => {
	const { control } = useFormContext<IUserEdit>();
	const { errors, isSubmitting, isDirty } = useFormState({ control });
	const onSubmit = useOnSubmitUserEditForm(id);

	return (
		<BaseForm onSubmit={onSubmit}>
			<div className="w-full flex items-start justify-between gap-2">
				<div className="flex flex-col gap-2 w-full">
					<TextField isDisabled>
						<Label>Email</Label>
						<Input value={email} readOnly />
					</TextField>
					{[
						{
							key: 'names-group',
							items: [
								{
									key: 'surname',
									render: (
										<Controller
											name="surname"
											control={control}
											render={({ field }) => (
												<TextField isInvalid={!!errors.surname}>
													<Label>Фамилия</Label>
													<Input placeholder="Фамилия" {...bindRhfTextField(field)} />
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
											name="name"
											control={control}
											render={({ field }) => (
												<TextField isInvalid={!!errors.name}>
													<Label>Имя</Label>
													<Input placeholder="Имя" {...bindRhfTextField(field)} />
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
											name="patronymic"
											control={control}
											render={({ field }) => (
												<TextField>
													<Label>Отчество</Label>
													<Input
														placeholder="Отчество"
														{...bindRhfNullableTextField(field)}
													/>
													<FieldError>{errors.patronymic?.message}</FieldError>
												</TextField>
											)}
										/>
									),
								},
							],
						},
						{
							key: 'phone-group',
							items: [
								{
									key: 'phone',
									render: (
										<Controller
											name="phone"
											control={control}
											render={({ field }) => (
												<TextField>
													<Label>Телефон</Label>
													<Input
														placeholder="Телефон"
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
									key: 'role',
									render: (
										<Controller
											name="role"
											control={control}
											render={({ field }) => (
												<Select
													className="w-full"
													name={field.name}
													isInvalid={!!errors.role}
													isDisabled={isSubmitting}
													value={field.value != null ? String(field.value) : null}
													onChange={(key) => {
														if (key == null) return;
														field.onChange(String(key) as EUserRole);
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
											name="status"
											control={control}
											render={({ field }) => (
												<Select
													className="w-full"
													name={field.name}
													isInvalid={!!errors.status}
													isDisabled={isSubmitting}
													value={field.value != null ? String(field.value) : null}
													onChange={(key) => {
														if (key == null) return;
														field.onChange(String(key) as EUserStatus);
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
							className="flex items-start gap-2 flex-wrap w-full"
							key={field.key}
						>
							{field.items.map((item) => (
								<div className="flex-1" key={item.key}>
									{item.render}
								</div>
							))}
						</div>
					))}
				</div>
				<FormActionBar
					primaryIcon={<FaSave />}
					isDisabled={!isDirty}
					secondaryAction={{
						label: 'Назад',
						onClick: () => history.back(),
					}}
				/>
			</div>
		</BaseForm>
	);
};
