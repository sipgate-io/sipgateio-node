import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { ShortMessage, SmsExtension, SmsSenderId } from './models/sms.model';
import { ErrorMessage as SmsErrors } from './errors/ErrorMessage';
import { UserInfo } from '../core/models';
import {
	containsPhoneNumber,
	createSMSModule,
	getSmsCallerIds,
	getUserSmsExtension,
} from './sms';

describe('SMS Module', () => {
	let mockClient: HttpClientModule;

	beforeEach(() => {
		mockClient = {} as HttpClientModule;
	});

	test('It sends a SMS successfully', async () => {
		const smsModule = createSMSModule(mockClient);

		mockClient.post = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({ data: {} }));

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '+4915739777777',
			smsId: 's0',
		};

		await expect(smsModule.send(message)).resolves.not.toThrow();
	});

	test('It sends an invalid SMS with smsId which does not exist', async () => {
		const smsModule = createSMSModule(mockClient);

		mockClient.post = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.reject({ response: { status: 403, data: {} } })
			);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '+4915739777777',
			smsId: 's999',
		};

		await expect(smsModule.send(message)).rejects.toThrowError(
			SmsErrors.SMS_INVALID_EXTENSION
		);
	});

	test('It throws when sending an SMS with an invalid smsId', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '015739777777',
			smsId: 'xyz123',
		};

		await expect(smsModule.send(message)).rejects.toThrowError(
			`${ErrorMessage.VALIDATOR_INVALID_EXTENSION}: ${message.smsId}`
		);
	});
	test('It sends SMS with no recipient', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '',
			smsId: 's0',
		};

		await expect(smsModule.send(message)).rejects.toThrowError(
			ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER
		);
	});

	test('It sends SMS with empty message', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: '',
			recipient: '+4915739777777',
			smsId: 's0',
		};

		await expect(smsModule.send(message)).rejects.toThrowError(
			SmsErrors.SMS_INVALID_MESSAGE
		);
	});
});

describe('schedule sms', () => {
	let mockClient: HttpClientModule;
	beforeAll(() => {
		mockClient = {} as HttpClientModule;
	});

	test('should use sendAt', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() + 60)
		);

		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({
				data: {},
				status: 200,
			});
		});
		await smsModule.send(message, date);

		expect(mockClient.post).toBeCalledWith('/sessions/sms', {
			...message,
			sendAt: date.getTime() / 1000,
		});
	});

	test('should throw an "SMS_TIME_MUST_BE_IN_FUTURE" error when using current date ', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() - 5)
		);

		await expect(smsModule.send(message, date)).rejects.toThrowError(
			SmsErrors.SMS_TIME_MUST_BE_IN_FUTURE
		);
	});

	test('should return an "SMS_TIME_TOO_FAR_IN_FUTURE" when providing a sendAt greater than 30 days in advance', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() + 60 * 60 * 24 * 31)
		);

		await expect(smsModule.send(message, date)).rejects.toThrowError(
			SmsErrors.SMS_TIME_TOO_FAR_IN_FUTURE
		);
	});

	test('should return an invalid date format error', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			recipient: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date('08 bar 2015');

		await expect(smsModule.send(message, date)).rejects.toThrowError(
			SmsErrors.SMS_TIME_INVALID
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
						alias: '"Alexander Bain\'s fax"',
						callerId: '+94123456789',
						id: 'f0',
					},
				],
			},
			status: 200,
		};

		const mockedClient = {} as HttpClientModule;

		mockedClient.get = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockData));

		await expect(
			getUserSmsExtension(mockedClient, mockUserID)
		).resolves.not.toThrow();
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
						verified: true,
					},
					{
						defaultNumber: false,
						id: 1,
						phonenumber: '+4987654321',
						verified: false,
					},
				],
			},
		};

		const userInfo: UserInfo = {
			domain: '',
			locale: '',
			masterSipId: '',
			sub: '',
		};

		const smsExtension: SmsExtension = {
			alias: 'SMS Extension',
			callerId: '+4912345678',
			id: 's0',
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
		const smsCallerIds: SmsSenderId[] = [
			{
				defaultNumber: true,
				id: 0,
				phonenumber: '+4912345678',
				verified: true,
			},
			{
				defaultNumber: false,
				id: 1,
				phonenumber: '+4987654321',
				verified: false,
			},
		];

		const verificationStatus = containsPhoneNumber(smsCallerIds, '+4912345678');

		expect(verificationStatus).toBeTruthy();
	});

	test('should not verify phone number', async () => {
		const smsCallerIds: SmsSenderId[] = [
			{
				defaultNumber: true,
				id: 0,
				phonenumber: '+4912345678',
				verified: true,
			},
			{
				defaultNumber: false,
				id: 1,
				phonenumber: '+4987654321',
				verified: false,
			},
		];

		const verificationStatus = containsPhoneNumber(smsCallerIds, '+4987654321');

		expect(verificationStatus).toBeFalsy();
	});

	test('should not verify phone unknown number', async () => {
		const smsCallerIds: SmsSenderId[] = [
			{
				defaultNumber: true,
				id: 0,
				phonenumber: '+4912345678',
				verified: true,
			},
			{
				defaultNumber: false,
				id: 1,
				phonenumber: '+4987654321',
				verified: false,
			},
		];

		const verificationStatus = containsPhoneNumber(smsCallerIds, '12345678');

		expect(verificationStatus).toBeFalsy();
	});
});
