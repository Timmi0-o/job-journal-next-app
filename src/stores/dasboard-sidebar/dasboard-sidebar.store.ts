'use client';

import { makeAutoObservable, runInAction } from 'mobx';

const DASHBOARD_SIDEBAR_EXPANDED_STORAGE_KEY =
	'job-journal-dashboard-sidebar-expanded';

class DashboardSidebarStore {
	isExpanded = ((): boolean => {
		if (typeof window === 'undefined') {
			return false;
		}
		try {
			const raw = window.localStorage.getItem(DASHBOARD_SIDEBAR_EXPANDED_STORAGE_KEY);
			if (raw === null) {
				return false;
			}
			const parsed: unknown = JSON.parse(raw);
			return typeof parsed === 'boolean' ? parsed : false;
		} catch {
			return false;
		}
	})();

	constructor() {
		makeAutoObservable(this);

		if (typeof window !== 'undefined') {
			window.addEventListener('storage', this.handleStorageEvent);
		}
	}

	private handleStorageEvent = (event: StorageEvent): void => {
		if (
			event.key !== DASHBOARD_SIDEBAR_EXPANDED_STORAGE_KEY ||
			event.storageArea !== window.localStorage ||
			event.newValue === null
		) {
			return;
		}
		try {
			const parsed: unknown = JSON.parse(event.newValue);
			if (typeof parsed !== 'boolean' || parsed === this.isExpanded) {
				return;
			}
			runInAction(() => {
				this.isExpanded = parsed;
			});
		} catch {
			// ignore invalid payload from other tabs
		}
	};

	private persistIsExpanded = (): void => {
		if (typeof window === 'undefined') {
			return;
		}
		try {
			window.localStorage.setItem(
				DASHBOARD_SIDEBAR_EXPANDED_STORAGE_KEY,
				JSON.stringify(this.isExpanded)
			);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	};

	setIsExpanded = (isExpanded: boolean): void => {
		this.isExpanded = isExpanded;
		this.persistIsExpanded();
	};

	toggleIsExpanded = (): void => {
		this.isExpanded = !this.isExpanded;
		this.persistIsExpanded();
	};
}

export const dashboardSidebarStore = new DashboardSidebarStore();
