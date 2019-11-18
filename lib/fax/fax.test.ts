/* eslint @typescript-eslint/ban-ts-ignore: 0 */
import { ErrorMessage } from '../core/errors';
import { FaxDTO } from '../core/models';
import { HttpClientModule } from '../core/httpClient';
import { createFaxModule, getUserFaxLines } from './fax';
import validPDFBuffer from '../core/validator/validPDFBuffer';

describe('Faxline ID List', () => {
	let mockClient: HttpClientModule;

	beforeAll(() => {
		mockClient = {} as HttpClientModule;
	});

	test('should get faxline ID LIST', async () => {
		const mockUserID = '0000000';
		const mockData = {
			data: {
				items: [
					{
						alias: 'Alexander Bains fax',
						canReceive: false,
						canSend: false,
						id: 'f0',
						tagline: 'Example Ltd.',
					},
				],
			},
		};

		mockClient.get = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockData));

		expect(async () => {
			await getUserFaxLines(mockClient, mockUserID);
		}).not.toThrow();

		const userFaxLines = await getUserFaxLines(mockClient, mockUserID);
		expect(userFaxLines).toEqual(mockData.data.items);
	});

	test('should throw an exception', async () => {
		const mockUserID = '0000000';

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.reject({
					response: { data: { status: 404, message: 'resource not found' } },
				})
			)
			.mockImplementationOnce(() =>
				Promise.reject({ response: { data: { status: 401 } } })
			);

		await expect(
			getUserFaxLines(mockClient, mockUserID)
		).rejects.toThrowError();
	});
});

describe('SendFax', () => {
	let mockClient: HttpClientModule;

	beforeAll(() => {
		mockClient = {} as HttpClientModule;
	});

	test('fax is sent', async () => {
		const faxModule = createFaxModule(mockClient);

		mockClient.post = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ data: { sessionId: '123123' } })
			);
		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ data: { type: 'FAX', faxStatusType: 'SENT' } })
			);

		const recipient = '+4912368712';
		const fileContent = validPDFBuffer;
		const faxlineId = 'f0';

		await expect(
			faxModule.send({
				faxlineId,
				fileContent,
				filename: 'testPdfFileName',
				recipient,
			})
		).resolves.not.toThrow();
	});

	test('fax is sent without given faxline id', async () => {
		mockClient.post = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ data: { sessionId: '123123' } })
			);
		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() => {
				return Promise.resolve({
					data: {
						domain: 'domain',
						locale: 'locale',
						masterSipId: 'masterSipId',
						sub: '123123',
					},
				});
			})
			.mockImplementationOnce(() =>
				Promise.resolve({ data: { items: [{ id: '0' }, { id: '1' }] } })
			)
			.mockImplementationOnce(() =>
				Promise.resolve({ data: { type: 'FAX', faxStatusType: 'SENT' } })
			);

		const faxModule = createFaxModule(mockClient);

		const recipient = '+4912368712';
		const fileContent = validPDFBuffer;

		await expect(
			faxModule.send({ recipient, fileContent, filename: 'testPdfFileName' })
		).resolves.not.toThrow();
	});

	test('fax is sent without given filename', async () => {
		mockClient.post = jest
			.fn()
			.mockImplementationOnce((_, { filename }: FaxDTO) => {
				expect(filename && /^Fax_2\d{7}_\d{4}$/.test(filename)).toBeTruthy();
				return Promise.resolve({ data: { sessionId: 123456 } });
			});

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ data: { type: 'FAX', faxStatusType: 'SENT' } })
			);

		const faxModule = createFaxModule(mockClient);

		const recipient = '+4912368712';
		const fileContent = validPDFBuffer;
		const faxlineId = 'f0';

		await faxModule.send({ recipient, fileContent, faxlineId });
	});
});

describe('GetFaxStatus', () => {
	let mockClient: HttpClientModule;

	beforeAll(() => {
		mockClient = {} as HttpClientModule;
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
			ErrorMessage.FAX_NOT_FOUND
		);
	});
});
