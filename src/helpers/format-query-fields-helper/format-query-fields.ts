import { IQueryObject } from '@/types/i-query-object';
import { createLogger } from '@/utils/logger.util';
import { IQueryField } from './types/i-query-field';
import { IRawQueryField } from './types/i-raw-query-field';
import { formatQueryBooleansFieldInternal } from './utils/format-query-booleans-field';
import { formatQueryDatesFieldInternal } from './utils/format-query-dates-field';
import { formatQueryLimitsFieldInternal } from './utils/format-query-limits-field';
import { formatQueryNumbersFieldInternal } from './utils/format-query-numbers-field';
import { formatQueryPagesFieldInternal } from './utils/format-query-pages-field';
import { formatQueryRequiredIdsFieldInternal } from './utils/format-query-required-ids-field';
import { formatQuerySearchFieldInternal } from './utils/format-query-search-field';
import { formatQueryStringsFieldInternal } from './utils/format-query-strings-field';

/**
 * Преобразует массив queryItems, определяя их fieldType и форматируя значения
 * в flat-объект, пригодный для запроса на backend.
 */
export const formatQueryFields = ({
	queryItems,
}: {
	queryItems: IRawQueryField | IRawQueryField[];
}): IQueryObject => {
	const logger = createLogger('FORMAT QUERY FIELDS');

	const normalizedQueryItems = Array.isArray(queryItems)
		? queryItems
		: [queryItems];

	const resultItems: Record<string, IQueryField> = {};

	normalizedQueryItems.forEach((queryItem) => {
		const { fieldType, key, ...queryItemWithoutFieldType } = queryItem;

		switch (fieldType) {
			case 'DATE': {
				const datesResult = formatQueryDatesFieldInternal(
					queryItemWithoutFieldType
				);
				if (datesResult.value.length) {
					resultItems[key] = datesResult;
				}
				break;
			}
			case 'NUMBER': {
				const numbersResult = formatQueryNumbersFieldInternal(
					queryItemWithoutFieldType
				);
				if (numbersResult.value.length) {
					resultItems[key] = numbersResult;
				}
				break;
			}
			case 'STRING': {
				const stringsResult = formatQueryStringsFieldInternal(
					queryItemWithoutFieldType
				);
				if (stringsResult.value.length) {
					resultItems[key] = stringsResult;
				}
				break;
			}
			case 'BOOLEAN': {
				const booleanResult = formatQueryBooleansFieldInternal(
					queryItemWithoutFieldType
				);
				if (typeof booleanResult === 'boolean') {
					resultItems[key] = booleanResult;
				}
				break;
			}
			case 'LIMIT':
				resultItems[key] = formatQueryLimitsFieldInternal(
					queryItemWithoutFieldType
				);
				break;
			case 'PAGE':
				resultItems[key] = formatQueryPagesFieldInternal(
					queryItemWithoutFieldType
				);
				break;
			case 'SEARCH': {
				const searchResult = formatQuerySearchFieldInternal(
					queryItemWithoutFieldType
				);
				if (searchResult) {
					resultItems[key] = searchResult;
				}
				break;
			}
			case 'REQUIRED_IDS': {
				const requiredIdsResult = formatQueryRequiredIdsFieldInternal(
					queryItemWithoutFieldType
				);
				if (requiredIdsResult?.length) {
					resultItems[key] = requiredIdsResult;
				}
				break;
			}
			default:
				logger.warn(`Unknown field type for QUERY ITEM: ${key} - ${fieldType}`);
		}
	});

	return resultItems;
};
