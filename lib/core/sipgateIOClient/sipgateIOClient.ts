import { AuthCredentials, SipgateIOClient } from './sipgateIOClient.module';
import { createCallModule } from '../../call';
import { createContactsModule } from '../../contacts';
import { createFaxModule } from '../../fax';
import { createHttpClient } from '../httpClient';
import { createSMSModule } from '../../sms';
import { createSettingsModule } from '../../webhook-settings';

export const createClient = (credentials: AuthCredentials): SipgateIOClient => {
	const httpClient = createHttpClient(
		credentials.username,
		credentials.password
	);
	return {
		call: createCallModule(httpClient),
		fax: createFaxModule(httpClient),
		sms: createSMSModule(httpClient),
		webhookSettings: createSettingsModule(httpClient),
		contacts: createContactsModule(httpClient),
	};
};
