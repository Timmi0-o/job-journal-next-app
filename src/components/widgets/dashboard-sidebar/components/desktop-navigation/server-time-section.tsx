'use client';

import { Tooltip } from '@heroui/react';
import clsx from 'clsx';
import type { ReactElement } from 'react';
import { useGetServerTime } from '../../hooks/use-get-server-time';
import styles from './desktop-navigation.module.css';

export const ServerTimeSection = ({
	isExpanded,
}: {
	isExpanded: boolean;
}): ReactElement => {
	const { moscowTime, moscowDateTimeFull } = useGetServerTime();

	const moscowTimeHHMM = moscowTime.split(':').slice(0, 2).join(':');

	return (
		<div
			className={clsx(styles.server_time, {
				[styles.server_time_expanded]: isExpanded,
				[styles.server_time_collapsed]: !isExpanded,
			})}
		>
			{isExpanded ? (
				<>
					<div className={styles.server_time_label}>МСК</div>
					<div className={styles.server_time_value}>{moscowDateTimeFull}</div>
				</>
			) : (
				<Tooltip delay={250}>
					<Tooltip.Trigger>
						<div className={styles.server_time_value}>{moscowTimeHHMM}</div>
					</Tooltip.Trigger>
					<Tooltip.Content
						placement="right"
						className={clsx(styles.tooltip_content, styles.visible)}
					>
						{`Серверное время (МСК): ${moscowDateTimeFull}`}
					</Tooltip.Content>
				</Tooltip>
			)}
		</div>
	);
};
