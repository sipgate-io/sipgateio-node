import { HttpClientModule } from '../core/httpClient';
import { Settings } from '../core/models';
import { SettingsModule } from './settings.module';

export const createSettingsModule = (
	client: HttpClientModule
): SettingsModule => ({
	async setIncomingUrl(url: string): Promise<void> {
		await getSettings(client).then(settings => {
			settings.incomingUrl = url;
			client.put(url, settings);
		});
	}
});

const getSettings = async (client: HttpClientModule): Promise<Settings> => {
	return client
		.get('settings/sipgateio')
		.then(res => res.data)
		.catch(error => error);
};
