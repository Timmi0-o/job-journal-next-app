import { makeAutoObservable } from 'mobx';

class LoaderStore {
	isLoading = false;
	isReplaceLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setIsLoading = (isLoading: boolean): void => {
		this.isLoading = isLoading;
	};

	setIsReplaceLoading = (isReplaceLoading: boolean): void => {
		this.isReplaceLoading = isReplaceLoading;
	};
}

export const loaderStore = new LoaderStore();
