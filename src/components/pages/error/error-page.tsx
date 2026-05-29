'use client';

import { IActionError } from '@/types/i-action.types';
import { Button, Card } from '@heroui/react';
import { LuHouse, LuRefreshCw, LuTriangleAlert } from 'react-icons/lu';
import './error-page-variables.css';
import styles from './error-page.module.css';

export const ErrorPage = ({ errors }: { errors: IActionError[] }) => {
	const handleReload = () => {
		window.location.reload();
	};

	const handleGoHome = () => {
		window.location.href = '/';
	};

	const handleClearQueryAndReload = () => {
		const path = window.location.pathname;
		window.location.replace(`${path.split('?')[0]}`);
	};

	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<Card.Header className={styles.cardHeader}>
					<div className={styles.iconContainer}>
						<LuTriangleAlert className={styles.icon} size={28} />
					</div>
					<h1 className={styles.title}>Произошла ошибка</h1>
				</Card.Header>

				<Card.Content className={styles.cardBody}>
					<p className={styles.description}>
						К сожалению, что-то пошло не так. Пожалуйста, попробуйте снова или
						обратитесь к администратору.
					</p>
					<div className={styles.errorBox}>
						<p className={styles.errorText}>
							{errors?.map((error) => error.message).join(', ')}
						</p>
					</div>
				</Card.Content>

				<Card.Footer className={styles.cardFooter}>
					<Button variant="secondary" onPress={handleReload}>
						<LuRefreshCw size={16} />
						Обновить страницу
					</Button>
					<Button onPress={handleGoHome}>
						<LuHouse size={16} />
						На главную
					</Button>
					<Button variant="tertiary" size="sm" onPress={handleClearQueryAndReload}>
						<LuHouse size={16} />
						Очистить query и перезагрузить
					</Button>
				</Card.Footer>
			</Card>
		</div>
	);
};
