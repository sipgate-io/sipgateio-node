import { ErrorMessage } from '../errors/ErrorMessage';
import { ValidationResult } from '../../core/validator';

const validateWebhookUrl = (url: string): ValidationResult => {
	const webhookUrlRegex = new RegExp(/^(http|https):\/\//i);

	if (!webhookUrlRegex.test(url)) {
		return {
			cause: `${ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL}: ${url}`,
			isValid: false,
		};
	}
	return { isValid: true };
};
export { validateWebhookUrl };
