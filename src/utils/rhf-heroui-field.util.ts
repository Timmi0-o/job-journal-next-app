import type { ChangeEvent } from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

type TextFieldChangeArg = ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string;

const getTextFieldValue = (value: TextFieldChangeArg): string => {
	if (typeof value === 'string') {
		return value;
	}

	return value.target.value;
};

/**
 * HeroUI v3 Input/TextArea (react-aria) ожидают контролируемые value/onChange.
 * onChange может прийти как ChangeEvent или как строка — поддерживаем оба варианта.
 */
export const bindRhfTextField = <T extends FieldValues>(
	field: ControllerRenderProps<T, Path<T>>
): {
	name: string;
	ref: ControllerRenderProps<T, Path<T>>['ref'];
	onBlur: ControllerRenderProps<T, Path<T>>['onBlur'];
	value: string;
	onChange: (value: TextFieldChangeArg) => void;
} => {
	const raw = field.value;
	const value = raw == null ? '' : String(raw);

	return {
		name: field.name,
		ref: field.ref,
		onBlur: field.onBlur,
		value,
		onChange: (nextValue: TextFieldChangeArg) => {
			field.onChange(getTextFieldValue(nextValue) as never);
		},
	};
};

export const bindRhfNullableTextField = <T extends FieldValues>(
	field: ControllerRenderProps<T, Path<T>>
): {
	name: string;
	ref: ControllerRenderProps<T, Path<T>>['ref'];
	onBlur: ControllerRenderProps<T, Path<T>>['onBlur'];
	value: string;
	onChange: (value: TextFieldChangeArg) => void;
} => {
	const bound = bindRhfTextField(field);

	return {
		...bound,
		onChange: (nextValue: TextFieldChangeArg) => {
			const value = getTextFieldValue(nextValue);
			field.onChange((value || null) as never);
		},
	};
};
