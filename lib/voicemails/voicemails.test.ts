import { SipgateIOClient } from '../core/sipgateIOClient';
import { Voicemail } from './voicemails.types';
import { createVoicemailsModule } from './voicemails';

describe('voicemails module', () => {
	it('extracts the `items` from the API response', async () => {
		const testVoicemails: Voicemail[] = [
			{
				id: 'v0',
				alias: 'Voicemail von Peterle Drobusch-Lukfgx',
				belongsToEndpoint: {
					extension: 'w0',
					type: 'USER',
				},
			},
		];
		const mockClient = {} as SipgateIOClient;

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({ items: testVoicemails }));

		const voicemailsModule = createVoicemailsModule(mockClient);

		const voicemails = await voicemailsModule.getVoicemails();
		expect(voicemails).toEqual(testVoicemails);

		expect(mockClient.get).toHaveBeenCalledWith(`voicemails`);
	});
});
