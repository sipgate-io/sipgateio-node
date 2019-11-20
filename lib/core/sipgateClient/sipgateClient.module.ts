import { CallModule } from '../../call';
import { ContactsModule } from '../../contacts';
import { FaxModule } from '../../fax';
import { SMSModule } from '../../sms';
import { SettingsModule } from '../../settings';

export interface SipgateClient {
	sms: SMSModule;
	fax: FaxModule;
	call: CallModule;
	settings: SettingsModule;
	contacts: ContactsModule;
}

export interface BasicAuthCredentials {
	username: string;
	password: string;
}

export type AuthCredentials = BasicAuthCredentials;
