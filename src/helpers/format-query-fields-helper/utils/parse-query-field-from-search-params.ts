import { isNumberTest } from '@/utils/is-number-test.util';
import { IFieldsTypes } from '../types/i-query-field-types';

export type IParsedQueryFieldValue =
	| string
	| string[]
	| number
	| boolean
	| null;

const parseMultiStringParam = (rawValues: string[]): string | string[] | null => {
	const filtered = rawValues.filter(Boolean);

	if (filtered.length === 0) {
		return null;
	}

	if (filtered.length === 1) {
		return filtered[0];
	}

	return filtered;
};

export const parseQueryFieldValueFromSearchParams = (
	keyType: IFieldsTypes,
	searchParams: URLSearchParams,
	key: string
): IParsedQueryFieldValue => {
	switch (keyType) {
		case 'BOOLEAN': {
			const value = searchParams.get(key);

			if (value === 'true') return true;
			if (value === 'false') return false;

			return null;
		}
		case 'LIMIT': {
			const value = searchParams.get(key);

			if (value === null || !isNumberTest(value)) {
				return 25;
			}

			return Number(value);
		}
		case 'PAGE': {
			const value = searchParams.get(key);

			if (value === null || !isNumberTest(value)) {
				return 1;
			}

			return Number(value);
		}
		case 'SEARCH':
		case 'REQUIRED_IDS': {
			return searchParams.get(key) ?? '';
		}
		case 'STRING':
		case 'DATE':
		case 'NUMBER': {
			return parseMultiStringParam(searchParams.getAll(key));
		}
	}
};
