'use client';

import type { TConfirmationStatus } from '@/hooks/use-confirmation';
import { AlertDialog, Button } from '@heroui/react';
import React from 'react';

interface IConfirmationModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel: () => void;
	primaryLabel?: string;
	cancelLabel?: string;
	status?: TConfirmationStatus;
}

export const ConfirmationModal = ({
	isOpen,
	title,
	description,
	onConfirm,
	onCancel,
	primaryLabel,
	cancelLabel = 'Отмена',
	status = 'accent',
}: IConfirmationModalProps): React.ReactElement => {
	const isDangerStatus = status === 'danger';

	return (
		<AlertDialog
			isOpen={isOpen}
			onOpenChange={(isNextOpen) => {
				if (!isNextOpen) onCancel();
			}}
		>
			<AlertDialog.Backdrop>
				<AlertDialog.Container>
					<AlertDialog.Dialog className="sm:max-w-[400px]">
						<AlertDialog.CloseTrigger />
						<AlertDialog.Header>
							<AlertDialog.Icon status={status} />
							<AlertDialog.Heading>{title}</AlertDialog.Heading>
						</AlertDialog.Header>
						<AlertDialog.Body>
							<p className="text-muted">{description}</p>
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button variant="tertiary" onPress={onCancel}>
								{cancelLabel}
							</Button>
							<Button
								variant={isDangerStatus ? 'danger' : 'primary'}
								onPress={onConfirm}
							>
								{primaryLabel ?? 'Подтвердить'}
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	);
};
