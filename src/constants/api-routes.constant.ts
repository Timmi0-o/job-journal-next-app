export const API_URL = process.env.API_URL

export const API_ROUTES = {
	auth: {
		login: `${API_URL}/auth/login`,
		refresh: `${API_URL}/auth/refresh`,
	},
	unit: {
		units: `${API_URL}/units`,
		unitOne: (id: string | number) => `${API_URL}/units/${id}`,
		unitCreate: `${API_URL}/units`,
		unitEdit: (id: string | number) => `${API_URL}/units/${id}`,
		unitDelete: (id: string | number) => `${API_URL}/units/${id}`,
	},
	jobVariant: {
		jobVariants: `${API_URL}/job-variants`,
		jobVariantOne: (id: string | number) => `${API_URL}/job-variants/${id}`,
		jobVariantCreate: `${API_URL}/job-variants`,
		jobVariantEdit: (id: string | number) => `${API_URL}/job-variants/${id}`,
		jobVariantDelete: (id: string | number) => `${API_URL}/job-variants/${id}`,
	},
	journal: {
		journals: `${API_URL}/journals`,
		journalOne: (id: string | number) => `${API_URL}/journals/${id}`,
		journalCreate: `${API_URL}/journals`,
		journalEdit: (id: string | number) => `${API_URL}/journals/${id}`,
		journalDelete: (id: string | number) => `${API_URL}/journals/${id}`,
	},
	user: {
		users: `${API_URL}/users`,
		userOne: (id: string | number) => `${API_URL}/users/${id}`,
		userCreate: `${API_URL}/users`,
		userEdit: (id: string | number) => `${API_URL}/users/${id}`,
		userDelete: (id: string | number) => `${API_URL}/users/${id}`,
	},
} as const
