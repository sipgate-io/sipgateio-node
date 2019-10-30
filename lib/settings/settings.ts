import { ConnectionError, ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { Settings } from '../core/models';
import { SettingsModule } from './settings.module';
import handleCoreError from '../core/errors/handleCoreError';

const SETTINGS_ENDPOINT = 'settings/sipgateio';

export const createSettingsModule = (
	client: HttpClientModule
): SettingsModule => ({
	async setIncomingUrl(url: string): Promise<void> {
		await getSettings(client)
			.then(settings => {
				settings.incomingUrl = url;
				client.put(SETTINGS_ENDPOINT, settings);
			})
			.catch(error => handleError(error));
	},
	async setOutgoingUrl(url: string): Promise<void> {
		await getSettings(client)
			.then(settings => {
				settings.outgoingUrl = url;
				client.put(SETTINGS_ENDPOINT, settings);
			})
			.catch(error => handleError(error));
	},
	async setWhitelist(extensions: string[]): Promise<void> {
		await getSettings(client)
			.then(settings => {
				settings.whitelist = extensions;
				client.put(SETTINGS_ENDPOINT, settings);
			})
			.catch(error => handleError(error));
	}
});

const getSettings = async (client: HttpClientModule): Promise<Settings> => {
	return client
		.get(SETTINGS_ENDPOINT)
		.then(res => res.data)
		.catch(error => handleError(error));
};

const handleError = (e: any) => {
	if (
		e.message === 'Network Error' ||
		e.message.includes(ErrorMessage.NETWORK_ERROR)
	) {
		return new ConnectionError();
	}
	return handleCoreError(e.message);
};
