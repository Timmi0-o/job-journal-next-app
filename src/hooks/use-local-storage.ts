'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Serializable =
	| string
	| number
	| boolean
	| null
	| Serializable[]
	| { [key: string]: Serializable }
	| Set<unknown>
	| Map<unknown, unknown>
	| Date;

function replacer(_key: string, value: unknown): unknown {
	if (value instanceof Set) {
		return { __type: 'Set', _values: Array.from(value) };
	}
	if (value instanceof Map) {
		return { __type: 'Map', _values: Array.from(value.entries()) };
	}
	if (value instanceof Date) {
		return { __type: 'Date', _value: value.toISOString() };
	}
	return value;
}

function reviver(_key: string, value: unknown): unknown {
	const typed = value as { __type?: string; _values?: unknown; _value?: string };
	if (typed?.__type === 'Set') {
		return new Set(typed._values as unknown[]);
	}
	if (typed?.__type === 'Map') {
		return new Map(typed._values as [unknown, unknown][]);
	}
	if (typed?.__type === 'Date') {
		return new Date(typed._value as string);
	}
	return value;
}

export default function useLocalStorage<T extends Serializable>(
	key: string,
	initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window !== 'undefined') {
			try {
				const item = window.localStorage.getItem(key);
				if (item) {
					return JSON.parse(item, reviver) as T;
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		}
		return initialValue;
	});

	useEffect(() => {
		try {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(storedValue, replacer));
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
}
