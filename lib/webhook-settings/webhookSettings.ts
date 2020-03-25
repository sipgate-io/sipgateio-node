import { ErrorMessage } from './errors/ErrorMessage';
import { ExtensionType, validateExtension } from '../core/validator';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { WebhookSettings } from './models/webhook-settings.model';
import { WebhookSettingsModule } from './webhookSettings.module';
import { handleCoreError } from '../core/errors/handleError';
import { validateWebhookUrl } from './validators/validateWebhookUrl';

const SETTINGS_ENDPOINT = 'settings/sipgateio';

export const createSettingsModule = (
	client: HttpClientModule
): WebhookSettingsModule => ({
	async setIncomingUrl(url): Promise<void> {
		const validationResult = validateWebhookUrl(url);

		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await modifyWebhookSettings(
			client,
			settings => (settings.incomingUrl = url)
		);
	},

	async setOutgoingUrl(url): Promise<void> {
		const validationResult = validateWebhookUrl(url);
		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await modifyWebhookSettings(
			client,
			settings => (settings.outgoingUrl = url)
		);
	},

	async setWhitelist(extensions): Promise<void> {
		validateWhitelistExtensions(extensions);

		await modifyWebhookSettings(
			client,
			settings => (settings.whitelist = extensions)
		);
	},

	async setLog(value): Promise<void> {
		await modifyWebhookSettings(client, settings => (settings.log = value));
	},

	async clearIncomingUrl(): Promise<void> {
		await modifyWebhookSettings(
			client,
			settings => (settings.incomingUrl = '')
		);
	},

	async clearOutgoingUrl(): Promise<void> {
		await modifyWebhookSettings(
			client,
			settings => (settings.outgoingUrl = '')
		);
	},

	async clearWhitelist(): Promise<void> {
		await modifyWebhookSettings(client, settings => (settings.whitelist = []));
	},

	async disableWhitelist(): Promise<void> {
		await modifyWebhookSettings(
			client,
			settings => (settings.whitelist = null)
		);
	},
});

const getWebhookSettings = async (
	client: HttpClientModule
): Promise<WebhookSettings> => {
	return client
		.get(SETTINGS_ENDPOINT)
		.then(res => res.data)
		.catch(error => handleError(error));
};

const modifyWebhookSettings = async (
	client: HttpClientModule,
	fn: (s: WebhookSettings) => void
): Promise<void> => {
	await getWebhookSettings(client)
		.then(settings => {
			fn(settings);
			return client.put(SETTINGS_ENDPOINT, settings);
		})
		.catch(error => handleError(error));
};

const validateWhitelistExtensions = (extensions: string[]): void => {
	extensions.forEach(extension => {
		const validationResult = validateExtension(extension, [
			ExtensionType.PERSON,
			ExtensionType.GROUP,
		]);
		if (!validationResult.isValid) {
			throw new Error(
				`${ErrorMessage.VALIDATOR_INVALID_EXTENSION_FOR_WEBHOOKS}\n${validationResult.cause}: ${extension}`
			);
		}
	});
};

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 403) {
		return new Error(ErrorMessage.WEBHOOK_SETTINGS_FEATURE_NOT_BOOKED);
	}
	return handleCoreError(error);
};
