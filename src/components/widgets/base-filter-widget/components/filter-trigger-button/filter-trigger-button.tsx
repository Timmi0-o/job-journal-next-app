'use client';

import clsx from 'clsx';
import { Button, ButtonGroup } from '@heroui/react';
import { IoClose, IoOptions } from 'react-icons/io5';
import styles from './filter-trigger-button.module.css';

interface IFilterTriggerButtonProps {
	onPress?: () => void;
	activeCount: number;
	onReset?: () => void;
}

export const FilterTriggerButton = ({
	onPress,
	activeCount,
	onReset,
}: IFilterTriggerButtonProps): React.ReactElement => {
	const hasActive = activeCount > 0;
	const hasReset = hasActive && Boolean(onReset);

	const triggerContent = (
		<>
			<IoOptions size={16} />
			Фильтры
			{hasActive ? (
				<span className={clsx(styles.badge, 'bg-white/25')}>{activeCount}</span>
			) : null}
		</>
	);

	if (hasReset) {
		return (
			<ButtonGroup size="md" variant="primary">
				<Button onPress={onPress} className={styles.trigger}>
					{triggerContent}
				</Button>
				<Button
					isIconOnly
					aria-label="Сбросить фильтры"
					onPress={onReset}
				>
					<IoClose size={14} aria-hidden />
				</Button>
			</ButtonGroup>
		);
	}

	return (
		<Button
			size="md"
			variant={hasActive ? 'primary' : 'secondary'}
			onPress={onPress}
			className={styles.trigger}
		>
			{triggerContent}
		</Button>
	);
};
