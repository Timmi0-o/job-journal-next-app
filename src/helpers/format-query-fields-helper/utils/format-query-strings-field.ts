import { QUERY_ARRAY_SEPARATOR } from '@/constants/query-array-separator'
import { IFormattedStringField } from '../types/i-query-field'
import { IRawQueryField } from '../types/i-raw-query-field'

export const formatQueryStringsFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): IFormattedStringField => {
	const { value, mode } = queryItem

	const normalizedValue = Array.isArray(value)
		? value
		: value?.split(QUERY_ARRAY_SEPARATOR).filter(Boolean)

	const resultItems = normalizedValue?.filter(
		(item): item is string => typeof item === 'string' && Boolean(item),
	)

	if (!resultItems) return { value: [], mode: 'OR' }

	return { value: resultItems, mode: mode === 'AND' ? 'AND' : 'OR' }
}
