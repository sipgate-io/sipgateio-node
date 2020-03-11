import { WebhookResponse as WebhookResponseType } from './webhookResponse';

describe('create webhookResponse module', () => {
	const webhookResponse = WebhookResponseType;

	it('should return a gather object without play tag', () => {
		const gatherOptions = { maxDigits: 1, timeout: 2000 };
		const gatherObject = {
			Gather: { _attributes: { maxDigits: '1', timeout: '2000' } },
		};
		const result = webhookResponse.gatherDTMF(gatherOptions);

		expect(gatherObject).toEqual(result);
	});

	it('should return a gather object with play tag', () => {
		const testUrl = 'www.testurl.de';
		const gatherOptions = {
			announcement: testUrl,
			maxDigits: 1,
			timeout: 2000,
		};
		const gatherObject = {
			Gather: {
				_attributes: { maxDigits: '1', timeout: '2000' },
				Play: { Url: testUrl },
			},
		};
		const result = webhookResponse.gatherDTMF(gatherOptions);

		expect(result).toEqual(gatherObject);
	});
});
