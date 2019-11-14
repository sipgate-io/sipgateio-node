import { ErrorMessage } from '../core/errors';
import { ExtensionType, validateExtension } from '../core/validator';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { Settings } from '../core/models';
import { SettingsModule } from './settings.module';
import { validateWebhookUrl } from '../core/validator/validateWebhookUrl';
import handleCoreError from '../core/errors/handleCoreError';

const SETTINGS_ENDPOINT = 'settings/sipgateio';

export const createSettingsModule = (
	client: HttpClientModule
): SettingsModule => ({
	async setIncomingUrl(url): Promise<void> {
		const validationResult = validateWebhookUrl(url);

		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await modifySettings(client, settings => (settings.incomingUrl = url));
	},

	async setOutgoingUrl(url): Promise<void> {
		const validationResult = validateWebhookUrl(url);
		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await modifySettings(client, settings => (settings.outgoingUrl = url));
	},

	async setWhitelist(extensions): Promise<void> {
		validateWhitelistExtensions(extensions);

		await modifySettings(client, settings => (settings.whitelist = extensions));
	},

	async setLog(value): Promise<void> {
		await modifySettings(client, settings => (settings.log = value));
	},

	async clearIncomingUrl(): Promise<void> {
		await modifySettings(client, settings => (settings.incomingUrl = ''));
	},

	async clearOutgoingUrl(): Promise<void> {
		await modifySettings(client, settings => (settings.outgoingUrl = ''));
	},

	async clearWhitelist(): Promise<void> {
		await modifySettings(client, settings => (settings.whitelist = []));
	},

	async disableWhitelist(): Promise<void> {
		await modifySettings(client, settings => (settings.whitelist = null));
	},
});

const getSettings = async (client: HttpClientModule): Promise<Settings> => {
	return client
		.get(SETTINGS_ENDPOINT)
		.then(res => res.data)
		.catch(error => handleError(error));
};

const modifySettings = async (
	client: HttpClientModule,
	fn: (s: Settings) => void
): Promise<void> => {
	await getSettings(client)
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
	if (!error.response) {
		return error;
	}

	return handleCoreError(error);
};
