import { IHttpParams } from '@/helpers/api.helper'
import { IQueryObject } from './i-query-object'

interface IBaseSearchFields {
	id?: string | number
}

export type IGetActionPresets = 'MINIMAL' | 'SHORT' | 'BASE'

export const GET_ACTION_PRESETS = {
	MINIMAL: 'MINIMAL',
	SHORT: 'SHORT',
	BASE: 'BASE',
} as const

interface IBaseRequestOptions {
	isPublic?: boolean
	url: string
}

export interface IGetActionOptions
	extends IBaseSearchFields, IBaseRequestOptions {
	params?: IHttpParams
	filters?: IQueryObject
	customFormatter?: (
		filters: IQueryObject,
	) => Record<string, string> | undefined
	isArray?: boolean
	preset?: IGetActionPresets
}

export interface IMutateActionOptions<T> {
	url: string
	params: IHttpParams & { body?: T }
	json?: boolean
	onOk?: () => void | Promise<void>
	isForbiddenLogout?: boolean
	isPublic?: boolean
}

export interface IActionError {
	statusCode: number
	timestamp: string
	message: string
	error: string
}

export interface IActionResponseMeta {
	limit?: number
	offset?: number
	totalCount?: number
	total?: number
	page?: number
}

export type IActionResponse<T> = {
	result: {
		data: T
		meta?: IActionResponseMeta
		success: boolean
		timestamp?: string
	}
	error?: IActionError
}
