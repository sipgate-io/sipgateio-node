import { ValidationResult } from '../../core/validator';
import { ValidatorMessages } from './ValidatorMessages';

const validateWebhookUrl = (url: string): ValidationResult => {
	const webhookUrlRegex = new RegExp(/^(http|https):\/\//i);

	if (!webhookUrlRegex.test(url)) {
		return {
			cause: `${ValidatorMessages.INVALID_WEBHOOK_URL}: ${url}`,
			isValid: false,
		};
	}
	return { isValid: true };
};
export { validateWebhookUrl };
