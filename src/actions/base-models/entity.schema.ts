import { z } from 'zod'

export const entityMetaShape = {
	id: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
}
