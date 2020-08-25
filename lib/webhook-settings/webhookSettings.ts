import { SipgateIOClient } from '../core/sipgateIOClient';
import {
	WebhookSettings,
	WebhookSettingsModule,
} from './webhookSettings.types';
import { handleWebhookSettingsError } from './errors/handleWebhookSettingError';
import { validateWebhookUrl } from './validators/validateWebhookUrl';
import { validateWhitelistExtensions } from './validators/validateWhitelistExtensions';

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

	getWebhookSettings(): Promise<WebhookSettings> {
		return getWebhookSettingsFromClient(client);
	},
});

const getWebhookSettingsFromClient = (
	client: SipgateIOClient
): Promise<WebhookSettings> => {
	return client
		.get<WebhookSettings>(SETTINGS_ENDPOINT)
		.catch((error) => Promise.reject(handleWebhookSettingsError(error)));
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
		.catch((error) => Promise.reject(handleWebhookSettingsError(error)));
};
