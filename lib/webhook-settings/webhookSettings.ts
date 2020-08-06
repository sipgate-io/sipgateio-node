import { ExtensionType, validateExtension } from '../core/validator';
import { SipgateIOClient } from '../core/sipgateIOClient';
import {
	WebhookSettingErrorMessage,
	handleWebhookSettingsError,
} from './errors/handleWebhookSettingError';
import {
	WebhookSettings,
	WebhookSettingsModule,
} from './webhookSettings.types';
import { validateWebhookUrl } from './validators/validateWebhookUrl';

const SETTINGS_ENDPOINT = 'settings/sipgateio';

export const createSettingsModule = (
	client: SipgateIOClient
): WebhookSettingsModule => ({
	async setIncomingUrl(url): Promise<void> {
		const validationResult = validateWebhookUrl(url);

		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await modifyWebhookSettings(
			client,
			(settings) => (settings.incomingUrl = url)
		);
	},

	async setOutgoingUrl(url): Promise<void> {
		const validationResult = validateWebhookUrl(url);
		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await modifyWebhookSettings(
			client,
			(settings) => (settings.outgoingUrl = url)
		);
	},

	async setWhitelist(extensions): Promise<void> {
		validateWhitelistExtensions(extensions);

		await modifyWebhookSettings(
			client,
			(settings) => (settings.whitelist = extensions)
		);
	},

	async setLog(value): Promise<void> {
		await modifyWebhookSettings(client, (settings) => (settings.log = value));
	},

	async clearIncomingUrl(): Promise<void> {
		await modifyWebhookSettings(
			client,
			(settings) => (settings.incomingUrl = '')
		);
	},

	async clearOutgoingUrl(): Promise<void> {
		await modifyWebhookSettings(
			client,
			(settings) => (settings.outgoingUrl = '')
		);
	},

	async clearWhitelist(): Promise<void> {
		await modifyWebhookSettings(
			client,
			(settings) => (settings.whitelist = [])
		);
	},

	async disableWhitelist(): Promise<void> {
		await modifyWebhookSettings(
			client,
			(settings) => (settings.whitelist = null)
		);
	},

	async getWebhookSettings(): Promise<WebhookSettings> {
		return getWebhookSettingsFromClient(client);
	},
});

const getWebhookSettingsFromClient = async (
	client: SipgateIOClient
): Promise<WebhookSettings> => {
	return client
		.get(SETTINGS_ENDPOINT)
		.then((res) => res.data)
		.catch((error) => handleWebhookSettingsError(error));
};

const modifyWebhookSettings = async (
	client: SipgateIOClient,
	fn: (s: WebhookSettings) => void
): Promise<void> => {
	await getWebhookSettingsFromClient(client)
		.then((settings) => {
			fn(settings);
			return client.put(SETTINGS_ENDPOINT, settings);
		})
		.catch((error) => handleWebhookSettingsError(error));
};

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
