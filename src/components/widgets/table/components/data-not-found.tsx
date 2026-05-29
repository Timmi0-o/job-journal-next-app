import type { ReactElement } from 'react';
import { MdOutlineTableRows } from 'react-icons/md';
import styles from './data-not-found.module.css';

export const TableDataNotFound = (): ReactElement => {
	return (
		<div className={styles.root} role="status" aria-live="polite">
			{/* КОНТЕНТ */}
			<div className={styles.inner}>
				<div className={styles.iconWrap} aria-hidden>
					<MdOutlineTableRows size={24} />
				</div>
				<div className={styles.textCol}>
					<p className={styles.kicker}>Нет данных</p>
				</div>
			</div>
		</div>
	);
};
