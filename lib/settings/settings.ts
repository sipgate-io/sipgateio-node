import { HttpClientModule } from '../core/httpClient';
import { Settings } from '../core/models';
import { SettingsModule } from './settings.module';

export const createSettingsModule = (
	client: HttpClientModule
): SettingsModule => ({
	async getSettings(): Promise<Settings> {
		const { data } = await client.get('settings/sipgateio');
		return data;
	}
});
