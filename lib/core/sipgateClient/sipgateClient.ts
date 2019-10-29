import { CallModule, createCallModule } from '../../call';
import { FaxModule, createFaxModule } from '../../fax';
import { SMSModule, createSMSModule } from '../../sms';
import { createHttpClient } from '../httpClient';
import {createSettingsModule, SettingsModule} from "../../settings";

export interface SipgateClient {
	sms: SMSModule;
	fax: FaxModule;
	call: CallModule;
	settings: SettingsModule;
}

export const createClient = (
	username: string,
	password: string
): SipgateClient => {
	const httpClient = createHttpClient(username, password);

	return {
		call: createCallModule(httpClient),
		fax: createFaxModule(httpClient),
		sms: createSMSModule(httpClient),
		settings: createSettingsModule(httpClient)
	};
};
