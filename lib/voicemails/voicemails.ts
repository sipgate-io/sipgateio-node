import { SipgateIOClient } from '../core/sipgateIOClient';
import { Voicemail, VoicemailsModule } from './voicemails.types';

export const createVoicemailsModule = (
	client: SipgateIOClient
): VoicemailsModule => ({
	getVoicemails(): Promise<Voicemail[]> {
		return client
			.get<{ items: Voicemail[] }>('voicemails')
			.then((response) => response.items);
	},
});
