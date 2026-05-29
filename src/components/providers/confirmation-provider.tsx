'use client';

import { ConfirmationModal } from '@/components/shared/ui/confirmation-modal/confirmation-modal';
import { ConfirmationContext, IConfirmationOptions } from '@/hooks/use-confirmation';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';

type TConfirmationState = IConfirmationOptions;

const ConfirmationProviderComponent = ({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode => {
	const [confirmationState, setConfirmationState] =
		useState<TConfirmationState | null>(null);

	const isOpen = Boolean(confirmationState);

	const closeConfirmation = useCallback((): void => {
		setConfirmationState(null);
	}, []);

	const confirm = useCallback((options: IConfirmationOptions): void => {
		setConfirmationState(options);
	}, []);

	const handleConfirm = useCallback((): void => {
		if (!confirmationState) return;

		confirmationState.onConfirm();
		closeConfirmation();
	}, [confirmationState, closeConfirmation]);

	const handleCancel = useCallback((): void => {
		if (!confirmationState) return;

		confirmationState.onCancel?.();
		closeConfirmation();
	}, [confirmationState, closeConfirmation]);

	const contextValue = useMemo(
		() => ({
			confirm,
		}),
		[confirm]
	);

	return (
		<ConfirmationContext.Provider value={contextValue}>
			{children}
			<ConfirmationModal
				isOpen={isOpen}
				title={confirmationState?.title ?? ''}
				description={confirmationState?.description ?? ''}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				primaryLabel={confirmationState?.primaryLabel}
				cancelLabel={confirmationState?.cancelLabel}
				status={confirmationState?.status}
			/>
		</ConfirmationContext.Provider>
	);
};

export const ConfirmationProvider = observer(ConfirmationProviderComponent);
