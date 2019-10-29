import { HttpClientModule } from '../core/httpClient';
import { Settings } from '../core/models';
import { SettingsModule } from './settings.module';

export const createSettingsModule = (
	client: HttpClientModule
): SettingsModule => ({
	async getSettings(): Promise<Settings> {
		console.log(client);
		return {
			outgoingUrl: '',
			incomingUrl: '',
			log: false,
			whitelist: []
		};
	}
});
