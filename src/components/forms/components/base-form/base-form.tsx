import clsx from 'clsx';
import {
	FieldValues,
	SubmitErrorHandler,
	SubmitHandler,
	useFormContext,
} from 'react-hook-form';

interface IBaseFormProps<T extends FieldValues = FieldValues> {
	children: React.ReactNode;
	onSubmit: SubmitHandler<T>;
	onInvalid?: SubmitErrorHandler<T>;
	id?: string;
	className?: string;
}

export const BaseForm = <T extends FieldValues = FieldValues>({
	children,
	onSubmit,
	onInvalid,
	id,
	className,
}: IBaseFormProps<T>) => {
	const { handleSubmit } = useFormContext<T>();

	return (
		<form
			id={id}
			className={clsx(
				'flex flex-col gap-4 w-full max-w-[1280px] mx-auto bg-[#f3f3f38d] dark:bg-zinc-800/10 p-5 rounded-4xl',
				className
			)}
			onSubmit={handleSubmit(onSubmit, onInvalid)}
		>
			{children}
		</form>
	);
};
