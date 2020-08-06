import { ExtensionType, validateExtension } from '../../core/validator';
import { WebhookSettingErrorMessage } from '../errors/handleWebhookSettingError';

const validateWhitelistExtensions = (extensions: string[]): void => {
	extensions.forEach((extension) => {
		const validationResult = validateExtension(extension, [
			ExtensionType.PERSON,
			ExtensionType.GROUP,
		]);
		if (!validationResult.isValid) {
			throw new Error(
				`${WebhookSettingErrorMessage.VALIDATOR_INVALID_EXTENSION_FOR_WEBHOOKS}\n${validationResult.cause}: ${extension}`
			);
		}
	});
};

export { validateWhitelistExtensions };
