import { CallData } from './models/call.model';
import { ErrorMessage as CallErrorMessage } from './errors/ErrorMessage';
import { CallModule } from './call.module';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { createCallModule } from './call';

describe('Call Module', () => {
	let callModule: CallModule;
	let mockClient: HttpClientModule;

	beforeEach(() => {
		mockClient = {} as HttpClientModule;
		callModule = createCallModule(mockClient);
	});

	it('should init a call successfully', async () => {
		const expectedSessionId = '123456';
		mockClient.post = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				data: {
					sessionId: expectedSessionId,
				},
				status: 200,
			});
		});
		const validExtension = 'e0';
		const validCalleeNumber = '+4915177777777';
		const validCallerId = '+4915122222222';

		const callData: CallData = {
			callee: validCalleeNumber,
			caller: validExtension,
			callerId: validCallerId,
		};

		await expect(callModule.initiate(callData)).resolves.not.toThrow();

		const { sessionId } = await callModule.initiate(callData);
		expect(sessionId).toEqual(expectedSessionId);
	});

	it('should throw an exception for malformed extension', async () => {
		const invalidExtensionId = 'e-18';
		const validCalleeNumber = '+4915177777777';
		const validCallerId = '+4915122222222';

		const callData: CallData = {
			callee: validCalleeNumber,
			caller: invalidExtensionId,
			callerId: validCallerId,
		};

		await expect(callModule.initiate(callData)).rejects.toThrowError(
			ErrorMessage.VALIDATOR_INVALID_CALLER
		);
	});

	it('should throw an exception for insufficient funds', async () => {
		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 402,
				},
			});
		});

		const validExtension = 'e8';
		const validCalleeNumber = '+4915177777777';
		const validCallerId = '+4915122222222';

		const callData: CallData = {
			callee: validCalleeNumber,
			caller: validExtension,
			callerId: validCallerId,
		};

		await expect(callModule.initiate(callData)).rejects.toThrowError(
			CallErrorMessage.CALL_INSUFFICIENT_FUNDS
		);
	});

	it('should throw a validation exception for malformed callee number ', async () => {
		const validExtensionId = 'e0';
		const invalidCalleeNumber = 'not a phone number';
		const validCallerId = '+494567787889';

		const callData: CallData = {
			callee: invalidCalleeNumber,
			caller: validExtensionId,
			callerId: validCallerId,
		};

		await expect(callModule.initiate(callData)).rejects.toThrowError(
			ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER
		);
	});
});
