import {
	TFilterWidgetFilterValue,
	TFilterWidgetFilters,
} from '../types/i-filter-widget-config';

const isSameFilterValue = (
	left: TFilterWidgetFilterValue,
	right: TFilterWidgetFilterValue
): boolean => {
	if (left === right) {
		return true;
	}

	if (left === null || right === null) {
		return left === right;
	}

	if (Array.isArray(left) && Array.isArray(right)) {
		if (left.length !== right.length) {
			return false;
		}

		return left.every((item, index) => item === right[index]);
	}

	return false;
};

export const isFiltersEqual = (
	left: TFilterWidgetFilters,
	right: TFilterWidgetFilters
): boolean => {
	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);

	if (leftKeys.length !== rightKeys.length) {
		return false;
	}

	return leftKeys.every((key) => isSameFilterValue(left[key], right[key]));
};
