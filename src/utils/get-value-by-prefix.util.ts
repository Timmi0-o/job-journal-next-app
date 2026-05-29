/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Извлекает значение из объекта по пути, заданному через префикс.
 * Путь задается как строка с использованием точек для объектов и квадратных скобок для массивов.
 * Например: "parent.child[0].name"
 *
 * @param {any} obj - Объект, из которого нужно извлечь значение.
 * @param {string} prefix - Путь к значению в объекте, может содержать массивы.
 * @returns {{ parent: any, key: string | number, value: any } | undefined} - Возвращает родительский объект, ключ и значение по указанному пути. Если путь неверен, возвращает undefined.
 *
 * @example
 * const obj = { parent: { child: [{ name: 'John' }] } };
 * const result = getValueByPrefix(obj, 'parent.child[0].name');
 * console.log(result); // { parent: { child: [ { name: 'John' } ] }, key: 0, value: 'John' }
 */

export const getValueByPrefix = (
	_obj: any,
	prefix: string
): { parent: any; key: string | number; value: any } | undefined => {
	const path = prefix
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.map((key) => (key.match(/^\d+$/) ? Number(key) : key));

	const parent: { parent: any; key: string | number; value: any } | undefined =
		path.reduce((_acc: any, key: string | number, index: number) => {
			if (_acc && _acc[key] !== undefined) {
				if (index === path.length - 1) {
					return { parent: _acc, key, value: _acc[key] };
				}
				return _acc[key];
			}
			return undefined;
		}, _obj);

	return parent;
};
