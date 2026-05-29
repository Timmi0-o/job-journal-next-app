/**
 * Проверяет, является ли значение числом или строкой, содержащей число.
 *
 * @example
 * isNumberTest(123);        // true
 * isNumberTest('-123.45');  // true
 * isNumberTest('abc');      // false
 */
export const isNumberTest = (value: unknown): boolean => {
	return (
		typeof value === 'number' ||
		(typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value))
	);
};
