import { Spinner } from '@heroui/react';
import type { ReactElement } from 'react';
import styles from './loading-table-data-block.module.css';

export const LoadingTableDataBlock = (): ReactElement => {
	return (
		<div
			className={styles.root}
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label="Загрузка данных таблицы"
		>
			{/* КОНТЕНТ */}
			<div className={styles.inner}>
				<div className={styles.spinnerWrap} aria-hidden>
					<Spinner color="current" size="md" />
				</div>
				<div className={styles.textCol}>
					<p className={styles.label}>Загрузка данных...</p>
					<p className={styles.hint}>Пожалуйста, подождите</p>
				</div>
			</div>
		</div>
	);
};
