import { createLogger } from '@/utils/logger.util';

const log = createLogger('AUTH');

export const authLog = {
	...log,
	action: log.info,
};
