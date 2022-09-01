import { FaxDTO } from './fax.types';
import { FaxErrorMessage } from './errors/handleFaxError';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { createFaxModule } from './fax';
import validPDFBuffer from './testfiles/validPDFBuffer';

describe('SendFax', () => {
	let mockClient: SipgateIOClient;

	beforeAll(() => {
		mockClient = {} as SipgateIOClient;
	});

	test('fax is sent', async () => {
		const faxModule = createFaxModule(mockClient);

		mockClient.post = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({ sessionId: '123123' }));
		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ type: 'FAX', faxStatusType: 'SENT' })
			);

		const to = '+4912368712';
		const fileContent = validPDFBuffer;
		const faxlineId = 'f0';

		await expect(
			faxModule.send({
				faxlineId,
				fileContent,
				filename: 'testPdfFileName',
				to,
			})
		).resolves.not.toThrow();
	});

	test('fax is sent without given filename', async () => {
		mockClient.post = jest
			.fn()
			.mockImplementationOnce((_, { filename }: FaxDTO) => {
				expect(filename && /^Fax_2\d{7}_\d{4}$/.test(filename)).toBeTruthy();
				return Promise.resolve({ sessionId: 123456 });
			});

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ type: 'FAX', faxStatusType: 'SENT' })
			);

		const faxModule = createFaxModule(mockClient);

		const to = '+4912368712';
		const fileContent = validPDFBuffer;
		const faxlineId = 'f0';

		await faxModule.send({ to, fileContent, faxlineId });
	});
});

describe('GetFaxStatus', () => {
	let mockClient: SipgateIOClient;

	beforeAll(() => {
		mockClient = {} as SipgateIOClient;
	});

	test('throws exception when fax status could not be fetched', async () => {
		mockClient.get = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const faxModule = createFaxModule(mockClient);

		await expect(faxModule.getFaxStatus('12345')).rejects.toThrowError(
			FaxErrorMessage.FAX_NOT_FOUND
		);
	});
});

describe('getFaxlines', () => {
	const mockuserId = 'w0';
	const mockClient: SipgateIOClient = {} as SipgateIOClient;

	test('extracts the `items` from the API response', async () => {
		const testFaxlines = [
			{
				id: 'f0',
				alias: "Alexander Bain's fax",
				tagline: 'Example Ltd.',
				canSend: false,
				canReceive: true,
			},
		];

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({ items: testFaxlines }));

		const faxModule = createFaxModule(mockClient);

		const faxlines = await faxModule.getFaxlines(mockuserId);
		expect(faxlines).toEqual(testFaxlines);

		expect(mockClient.get).toHaveBeenCalledWith(`${mockuserId}/faxlines`);
	});
});
