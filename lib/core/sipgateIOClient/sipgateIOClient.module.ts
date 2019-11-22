import { CallModule } from '../../call';
import { ContactsModule } from '../../contacts';
import { FaxModule } from '../../fax';
import { SMSModule } from '../../sms';
import { WebhookSettingsModule } from '../../webhook-settings';

export interface SipgateIOClient {
	sms: SMSModule;
	fax: FaxModule;
	call: CallModule;
	webhookSettings: WebhookSettingsModule;
	contacts: ContactsModule;
}

export interface BasicAuthCredentials {
	username: string;
	password: string;
}

export type AuthCredentials = BasicAuthCredentials;
