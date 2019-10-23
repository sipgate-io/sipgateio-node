import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import {
	ShortMessage,
	SmsCallerId,
	SmsExtension,
	UserInfo
} from '../core/models';
import {
	containsPhoneNumber,
	createSMSModule,
	getSmsCallerIds,
	getUserSMSExtensions
} from './sms';
import { SMSModule } from './sms.module';

describe('SMS Module', () => {
	const instance = axios.create();
	const mock = new MockAdapter(instance);
	const smsModule = createSMSModule(instance);

	beforeEach(() => {
		mock.reset();
	});

	test('It sends a SMS successfully', async () => {
		mock.onPost('/sessions/sms').reply(200, '');

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'validExtensionId'
		};

		await expect(smsModule.send(message)).resolves.not.toThrow();
	});

	test('It sends an invalid SMS with error', async () => {
		mock.onPost('/sessions/sms').reply(403);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'nonValidExtensionId'
		};

		await expect(smsModule.send(message)).rejects.toThrow(
			ErrorMessage.SMS_INVALID_EXTENSION
		);
	});

	test('It sends SMS with unreachable server with error', async () => {
		mock.onPost('/sessions/sms').networkError();

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'nonValidExtensionId'
		};

		await expect(smsModule.send(message)).rejects.toThrow(
			ErrorMessage.NETWORK_ERROR
		);
	});

	test('It sends SMS with no recipient', async () => {
		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '',
			smsId: 'validExtensionId'
		};
		await expect(smsModule.send(message)).rejects.toEqual(
			ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER
		);
	});

	test('It sends SMS with empty message', async () => {
		const message: ShortMessage = {
			message: '',
			recipient: '015739777777',
			smsId: 'validExtensionId'
		};
		await expect(smsModule.send(message)).rejects.toEqual(
			ErrorMessage.SMS_INVALID_MESSAGE
		);
	});
});

describe('schedule sms', () => {
	let mockedSmsModule: SMSModule;
	const instance = axios.create();
	const smsModule = createSMSModule(instance);

	let mockClient: HttpClientModule;
	beforeAll(() => {
		mockClient = {} as HttpClientModule;
		mockedSmsModule = createSMSModule(mockClient);
	});

	test('should use sendAt', async () => {
		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'validExtensionId'
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() + 60)
		);

		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({
				data: {},
				status: 200
			});
		});
		await mockedSmsModule.send(message, date);

		expect(mockClient.post).toBeCalledWith('/sessions/sms', {
			...message,
			sendAt: date.getTime() / 1000
		});
	});

	test('should throw an "SMS_TIME_MUST_BE_IN_FUTURE" error when using current date ', async () => {
		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'validExtensionId'
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() - 5)
		);

		await expect(smsModule.send(message, date)).rejects.toEqual(
			ErrorMessage.SMS_TIME_MUST_BE_IN_FUTURE
		);
	});

	test('should return an "SMS_TIME_TOO_FAR_IN_FUTURE" when providing a sendAt greater than 30 days in advance', async () => {
		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'validExtensionId'
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() + 60 * 60 * 24 * 31)
		);

		await expect(smsModule.send(message, date)).rejects.toEqual(
			ErrorMessage.SMS_TIME_TOO_FAR_IN_FUTURE
		);
	});

	test('should return an invalid date format error', async () => {
		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'validExtensionId'
		};

		const date: Date = new Date('08 bar 2015');

		await expect(smsModule.send(message, date)).rejects.toEqual(
			ErrorMessage.SMS_TIME_INVALID
		);
	});
});

describe('SMS Extension List', () => {
	test('should get SMS ID LIST', async () => {
		const mockUserID = '0000000';
		const mockData = {
			data: {
				items: [
					{
						alias: "Alexander Bain's fax",
						callerId: '+94123456789',
						id: 'f0'
					}
				]
			},
			status: 200
		};

		const mockedClient = {} as HttpClientModule;

		mockedClient.get = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockData));

		await expect(
			getUserSMSExtensions(mockedClient, mockUserID)
		).resolves.not.toThrow();

		const userFaxLines = await getUserSMSExtensions(mockedClient, mockUserID);
		expect(userFaxLines).toEqual(mockData.data.items);
	});
});

describe('CallerIds for SMS Extension', () => {
	test('should get callerIds for sms extension', async () => {
		const mockData = {
			data: {
				items: [
					{
						defaultNumber: true,
						id: 0,
						phonenumber: '+4912345678',
						verified: true
					},
					{
						defaultNumber: false,
						id: 1,
						phonenumber: '+4987654321',
						verified: false
					}
				]
			}
		};

		const userInfo: UserInfo = {
			domain: '',
			locale: '',
			masterSipId: '',
			sub: ''
		};

		const smsExtension: SmsExtension = {
			alias: 'SMS Extension',
			callerId: '+4912345678',
			id: 's0'
		};

		const mockedClient = {} as HttpClientModule;

		mockedClient.get = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockData));

		const callerIds = await getSmsCallerIds(
			mockedClient,
			userInfo.sub,
			smsExtension.id
		);
		expect(callerIds).toEqual(mockData.data.items);
	});
});

describe('Numbers Verification', () => {
	test('should verify phone number correctly', async () => {
		const smsCallerIds: SmsCallerId[] = [
			{
				defaultNumber: true,
				id: 0,
				phonenumber: '+4912345678',
				verified: true
			},
			{
				defaultNumber: false,
				id: 1,
				phonenumber: '+4987654321',
				verified: false
			}
		];

		const verificationStatus = containsPhoneNumber(smsCallerIds, '+4912345678');

		expect(verificationStatus).toBeTruthy();
	});

	test('should not verify phone number', async () => {
		const smsCallerIds: SmsCallerId[] = [
			{
				defaultNumber: true,
				id: 0,
				phonenumber: '+4912345678',
				verified: true
			},
			{
				defaultNumber: false,
				id: 1,
				phonenumber: '+4987654321',
				verified: false
			}
		];

		const verificationStatus = containsPhoneNumber(smsCallerIds, '+4987654321');

		expect(verificationStatus).toBeFalsy();
	});

	test('should not verify phone unknown number', async () => {
		const smsCallerIds: SmsCallerId[] = [
			{
				defaultNumber: true,
				id: 0,
				phonenumber: '+4912345678',
				verified: true
			},
			{
				defaultNumber: false,
				id: 1,
				phonenumber: '+4987654321',
				verified: false
			}
		];

		const verificationStatus = containsPhoneNumber(smsCallerIds, '12345678');

		expect(verificationStatus).toBeFalsy();
	});
});
