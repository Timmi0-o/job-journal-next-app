'use client'

import { useKeyDownAction } from '@/hooks/use-key-down-action'
import {
	Button,
	ButtonGroup,
	Dropdown,
	InputGroup,
	Tooltip,
} from '@heroui/react'
import { ChangeEvent, InputHTMLAttributes } from 'react'
import { BiSearch } from 'react-icons/bi'
import { FiX } from 'react-icons/fi'
import { PiMouseLeftClickFill } from 'react-icons/pi'
import styles from './input.module.css'

export interface IUsecase {
	key: string
	label: string
}

export interface IInputType extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'onSubmit'
> {
	onSubmit?: (value?: string) => void
	usecase?: IUsecase[]
	selectedOption?: string
	setSelectedOption?: (key: string) => void
	isClearable?: boolean
}

export const Input = ({
	onSubmit,
	usecase,
	selectedOption,
	setSelectedOption,
	className,
	isClearable,
	...props
}: IInputType) => {
	const selectedLabel = usecase?.find((c) => c.key === selectedOption)?.label
	const hasClearButton = Boolean(isClearable && props.value)
	const hasSubmitSection = Boolean(onSubmit)
	const hasSuffix = hasClearButton || hasSubmitSection

	useKeyDownAction({ key: 'Enter', action: () => onSubmit?.() })

	return (
		<InputGroup className={className}>
			{/* INPUT FIELD */}
			<InputGroup.Input {...props} />

			{hasSuffix ? (
				<InputGroup.Suffix className={styles.suffix}>
					{/* CLEAR BUTTON */}
					{hasClearButton ? (
						<Button
							isIconOnly
							variant='ghost'
							size='sm'
							onPress={() => {
								props.onChange?.({
									target: { value: '' },
								} as ChangeEvent<HTMLInputElement>)
								onSubmit?.('')
							}}
						>
							<FiX size={15} />
						</Button>
					) : null}

					{/* SUBMIT / USECASE SECTION */}
					{hasSubmitSection ? (
						<Tooltip delay={0}>
							<Tooltip.Trigger>
								{usecase?.length ? (
									/* BUTTON GROUP: submit + usecase selector */
									<ButtonGroup size='sm' variant='ghost'>
										<Button isIconOnly onPress={() => onSubmit?.()}>
											<PiMouseLeftClickFill size={17} />
										</Button>
										<Dropdown>
											<Dropdown.Trigger>
												<Button
													size='sm'
													variant='ghost'
													className={styles.dropdownTrigger}
												>
													<span className={styles.dropdownLabel}>
														{selectedLabel}
													</span>
												</Button>
											</Dropdown.Trigger>
											<Dropdown.Popover placement='bottom end'>
												<Dropdown.Menu
													disallowEmptySelection
													aria-label='Тип поиска'
													selectedKeys={selectedOption ? [selectedOption] : []}
													selectionMode='single'
													onSelectionChange={(keys) => {
														const key = (keys as Set<string>)
															.values()
															.next().value
														if (key) setSelectedOption?.(key)
													}}
												>
													{usecase.map((item) => (
														<Dropdown.Item key={item.key}>
															{item.label}
														</Dropdown.Item>
													))}
												</Dropdown.Menu>
											</Dropdown.Popover>
										</Dropdown>
									</ButtonGroup>
								) : (
									/* SIMPLE SEARCH BUTTON */
									<Button
										isIconOnly
										variant='ghost'
										size='sm'
										onPress={() => onSubmit?.()}
									>
										<BiSearch size={17} />
									</Button>
								)}
							</Tooltip.Trigger>
							<Tooltip.Content>Найти</Tooltip.Content>
						</Tooltip>
					) : null}
				</InputGroup.Suffix>
			) : null}
		</InputGroup>
	)
}
