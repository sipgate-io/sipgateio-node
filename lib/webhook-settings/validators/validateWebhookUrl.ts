import { ValidationResult } from '../../core/validator';
import { WebhookSettingErrorMessage } from '../errors/handleWebhookSettingError';

const validateWebhookUrl = (url: string): ValidationResult => {
	const webhookUrlRegex = new RegExp(/^(http|https):\/\//i);

	if (!webhookUrlRegex.test(url)) {
		return {
			cause: `${WebhookSettingErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL}: ${url}`,
			isValid: false,
		};
	}
	return { isValid: true };
};
export { validateWebhookUrl };
