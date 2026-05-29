'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './filter-field-shell.module.css';

interface IFilterFieldShellProps {
	label?: string;
	description?: string;
	layout?: 'vertical' | 'horizontal';
	htmlFor?: string;
	className?: string;
	children: ReactNode;
}

export const FilterFieldShell = ({
	label,
	description,
	layout = 'vertical',
	htmlFor,
	className,
	children,
}: IFilterFieldShellProps): React.ReactElement => {
	const isHorizontal = layout === 'horizontal';
	const isClickableRow = isHorizontal && Boolean(htmlFor);
	const labelId = htmlFor ? `${htmlFor}-label` : undefined;
	const hasMeta = Boolean(label || description);
	const Root = isClickableRow ? 'label' : 'div';

	return (
		<Root
			{...(isClickableRow && htmlFor ? { htmlFor } : {})}
			className={clsx(
				styles.root,
				{
					[styles.root_vertical]: !isHorizontal,
					[styles.root_horizontal]: isHorizontal,
					[styles.root_clickable]: isClickableRow,
				},
				className
			)}
		>
			{/* LABEL / META */}
			{hasMeta ? (
				isHorizontal ? (
					<div className={styles.row_meta}>
						{label ? (
							<span className={styles.label_horizontal} id={labelId}>
								{label}
							</span>
						) : null}
						{description ? (
							<span className={styles.description_horizontal}>{description}</span>
						) : null}
					</div>
				) : (
					<>
						{label ? (
							htmlFor ? (
								<label
									className={styles.label}
									htmlFor={htmlFor}
									id={labelId}
								>
									{label}
								</label>
							) : (
								<span className={styles.label} id={labelId}>
									{label}
								</span>
							)
						) : null}
						{description ? (
							<p className={styles.description}>{description}</p>
						) : null}
					</>
				)
			) : null}

			{/* CONTROL */}
			<div
				className={clsx(styles.control, {
					[styles.control_horizontal]: isHorizontal,
				})}
			>
				{children}
			</div>
		</Root>
	);
};
