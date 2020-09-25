import { ErrorMessage } from '../core/errors';
import { ShortMessage, SmsExtension, SmsSenderId } from './sms.types';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { SmsErrorMessage } from './errors/handleSmsError';
import { UserInfo } from '../core/core.types';
import {
	containsPhoneNumber,
	createSMSModule,
	getSmsCallerIds,
	getUserSmsExtension,
} from './sms';

describe('SMS Module', () => {
	let mockClient: SipgateIOClient;

	beforeEach(() => {
		mockClient = {
			async getAuthenticatedWebuserId(): Promise<string> {
				return 'w999';
			},
		} as SipgateIOClient;
	});

	it('sends a sms by using a validated phone number', async () => {
		const smsModule = createSMSModule(mockClient);

		mockClient.get = jest.fn().mockImplementation((args) => {
			if (args === 'authorization/userinfo') {
				return Promise.resolve({
					sub: 'w999',
				});
			}
			if (args === 'w999/sms') {
				return Promise.resolve({
					items: [
						{
							id: 's999',
							alias: 'SMS von Douglas Engelbart',
							callerId: '+4915739777777',
						},
					],
				});
			}
			if (args === 'w999/sms/s999/callerids') {
				return Promise.resolve({
					items: [
						{
							id: 0,
							phonenumber: 'sipgate',
							verified: true,
							defaultNumber: true,
						},
						{
							id: 123456,
							phonenumber: '+4915739777777',
							verified: true,
							defaultNumber: false,
						},
					],
				});
			}
			return Promise.reject({
				response: {
					status: 500,
					uri: args,
				},
			});
		});

		mockClient.post = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({}));

		mockClient.put = jest.fn().mockImplementation((args) => {
			if (
				args === 'w999/sms/s999/callerids/123456' ||
				args === 'w999/sms/s999/callerids/0'
			) {
				return Promise.resolve({});
			}
			return Promise.reject({
				response: {
					status: 500,
					uri: args,
				},
			});
		});

		await expect(
			smsModule.send({
				message: 'Lorem Ipsum Dolor',
				to: '+4915739777777',
				from: '+4915739777777',
			})
		).resolves.not.toThrow();
	});

	it('sends a SMS successfully', async () => {
		const smsModule = createSMSModule(mockClient);

		mockClient.post = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({}));

		const message: ShortMessage = {
			message: 'ValidMessage',
			to: '+4915739777777',
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
			to: '+4915739777777',
			smsId: 's999',
		};

		await expect(smsModule.send(message)).rejects.toThrowError(
			SmsErrorMessage.INVALID_EXTENSION
		);
	});

	test('It throws when sending an SMS with an invalid smsId', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			to: '015739777777',
			smsId: 'xyz123',
		};

		await expect(smsModule.send(message)).rejects.toThrowError(
			`${ErrorMessage.VALIDATOR_INVALID_EXTENSION}: ${message.smsId}`
		);
	});
	test('It sends SMS with no to', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			to: '',
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
			to: '+4915739777777',
			smsId: 's0',
		};

		await expect(smsModule.send(message)).rejects.toThrowError(
			SmsErrorMessage.INVALID_MESSAGE
		);
	});
});

describe('schedule sms', () => {
	let mockClient: SipgateIOClient;
	beforeAll(() => {
		mockClient = {} as SipgateIOClient;
	});

	test('should use sendAt', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			to: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() + 60)
		);

		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({});
		});
		await smsModule.send(message, date);

		expect(mockClient.post).toBeCalledWith('/sessions/sms', {
			message: 'ValidMessage',
			recipient: '+4915739777777',
			smsId: 's0',
			sendAt: date.getTime() / 1000,
		});
	});

	test('should throw an "SMS_TIME_MUST_BE_IN_FUTURE" error when using current date ', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			to: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() - 5)
		);

		await expect(smsModule.send(message, date)).rejects.toThrowError(
			SmsErrorMessage.TIME_MUST_BE_IN_FUTURE
		);
	});

	test('should return an "SMS_TIME_TOO_FAR_IN_FUTURE" when providing a sendAt greater than 30 days in advance', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			to: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date(
			new Date().setSeconds(new Date().getSeconds() + 60 * 60 * 24 * 31)
		);

		await expect(smsModule.send(message, date)).rejects.toThrowError(
			SmsErrorMessage.TIME_TOO_FAR_IN_FUTURE
		);
	});

	test('should return an invalid date format error', async () => {
		const smsModule = createSMSModule(mockClient);

		const message: ShortMessage = {
			message: 'ValidMessage',
			to: '+4915739777777',
			smsId: 's0',
		};

		const date: Date = new Date('08 bar 2015');

		await expect(smsModule.send(message, date)).rejects.toThrowError(
			SmsErrorMessage.TIME_INVALID
		);
	});
});

describe('The SMS module', () => {
	test("should correctly identify a webuser's smsExtension", async () => {
		const expectedId = 's0';
		const mockData = {
			items: [
				{
					alias: '"Alexander Bain\'s phone"',
					callerId: '+491517777777',
					id: expectedId,
				},
			],
			status: 200,
		};

		const mockedClient = {} as SipgateIOClient;

		mockedClient.get = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockData));

		expect(
			getUserSmsExtension(mockedClient, 'some webuserId')
		).resolves.toEqual(expectedId);
	});
});

describe('CallerIds for SMS Extension', () => {
	test('should get callerIds for sms extension', async () => {
		const mockData = {
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

		const mockedClient = {} as SipgateIOClient;

		mockedClient.get = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockData));

		const callerIds = await getSmsCallerIds(
			mockedClient,
			userInfo.sub,
			smsExtension.id
		);
		expect(callerIds).toEqual(mockData.items);
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
