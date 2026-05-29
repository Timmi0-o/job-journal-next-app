'use client';

import { Button, Label, Separator, Spinner, Switch } from '@heroui/react';
import type { ButtonVariants } from '@heroui/styles';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	type MouseEvent,
	type ReactNode,
} from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';

type ButtonVariant = NonNullable<ButtonVariants['variant']>;

type SecondaryAction = {
	label: string;
	icon?: ReactNode;
	onClick?: () => void;
	href?: string;
	variant?: ButtonVariant;
	isDisabled?: boolean;
};

type FormActionBarProps = {
	primaryLabel?: string;
	primaryIcon?: ReactNode;
	isDisabled?: boolean;
	statusText?: string;
	hintText?: string;
	secondaryAction?: SecondaryAction;
	extraContent?: ReactNode;
	className?: string;
	isPrimaryHidden?: boolean;
	setIsStayAfterSubmit?: Dispatch<SetStateAction<boolean>>;
	isStayAfterSubmit?: boolean;
	customBackHref?: string;
};

export const FormActionBar = ({
	primaryLabel = 'Сохранить',
	primaryIcon = <FaSave />,
	isDisabled,
	statusText,
	hintText,
	secondaryAction,
	extraContent,
	className,
	isPrimaryHidden,
	setIsStayAfterSubmit,
	isStayAfterSubmit,
	customBackHref,
}: FormActionBarProps) => {
	const router = useRouter();

	const { control } = useFormContext();
	const { isSubmitting, isSubmitSuccessful } = useFormState({ control });

	const showInfo = useMemo(
		() => statusText || hintText || isSubmitting,
		[statusText, hintText, isSubmitting]
	);

	const secondaryButton =
		secondaryAction &&
		(secondaryAction.href ? (
			<Button
				variant={secondaryAction.variant ?? 'tertiary'}
				isDisabled={secondaryAction.isDisabled}
				className="min-w-[120px]"
				size="sm"
			>
				<Link
					href={secondaryAction.href}
					className={clsx(
						'min-w-0 gap-2 no-underline size-full flex items-center justify-center',
						secondaryAction.isDisabled ? 'pointer-events-none' : undefined
					)}
					onClick={(e: MouseEvent<HTMLAnchorElement>) => {
						if (secondaryAction.isDisabled) {
							e.preventDefault();
						}
					}}
				>
					{secondaryAction.icon}
					{secondaryAction.label}
				</Link>
			</Button>
		) : (
			<Button
				type="button"
				onPress={secondaryAction.onClick}
				variant={secondaryAction.variant ?? 'tertiary'}
				isDisabled={secondaryAction.isDisabled}
				className="min-w-[120px]"
				size="sm"
			>
				{secondaryAction.icon}
				{secondaryAction.label}
			</Button>
		));

	const onPrimaryPress = useCallback(() => {
		if (!isSubmitSuccessful) return;

		if (!isStayAfterSubmit) {
			if (customBackHref) {
				router.push(customBackHref);
			} else {
				router.back();
			}
		}
	}, [isStayAfterSubmit, customBackHref]);

	return (
		<div className={clsx('sticky top-4 z-40 w-full sm:max-w-xs', className)}>
			<div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/85 shadow-[0_12px_45px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md dark:border-slate-800/60 dark:bg-zinc-900/90">
				<div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/60 via-transparent to-accent/5 dark:from-zinc-900/70 dark:to-slate/90" />
				<div className="relative flex flex-col gap-3 p-4">
					{extraContent ? (
						<>
							<div className="flex items-center gap-2">{extraContent}</div>
							<Separator />
						</>
					) : null}

					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						{!isPrimaryHidden ? (
							<Button
								type="submit"
								size="sm"
								variant="primary"
								onPress={onPrimaryPress}
								isPending={isSubmitting}
								isDisabled={isDisabled}
								className="flex-1 sm:flex-none min-w-[140px]"
							>
								{isSubmitting ? <Spinner size="sm" color="current" /> : primaryIcon}
								{primaryLabel}
							</Button>
						) : null}

						{secondaryButton}
					</div>

					{setIsStayAfterSubmit ? (
						<Switch
							isSelected={Boolean(isStayAfterSubmit)}
							onChange={setIsStayAfterSubmit}
							size="sm"
						>
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Content>
								<Label className="text-[11px] text-gray-400">
									Остаться на странице при сохранении
								</Label>
							</Switch.Content>
						</Switch>
					) : null}

					{showInfo && (
						<div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
							<span>{statusText ?? hintText ?? ''}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
