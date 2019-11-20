import { AuthCredentials, SipgateClient } from './sipgateClient.module';
import { createCallModule } from '../../call';
import { createContactsModule } from '../../contacts';
import { createFaxModule } from '../../fax';
import { createHttpClient } from '../httpClient';
import { createSMSModule } from '../../sms';
import { createSettingsModule } from '../../settings';

export const createClient = (credentials: AuthCredentials): SipgateClient => {
	const httpClient = createHttpClient(
		credentials.username,
		credentials.password
	);
	return {
		call: createCallModule(httpClient),
		fax: createFaxModule(httpClient),
		sms: createSMSModule(httpClient),
		settings: createSettingsModule(httpClient),
		contacts: createContactsModule(httpClient),
	};
};
