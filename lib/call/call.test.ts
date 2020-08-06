import { CallData, CallModule } from './call.types';
import { ErrorMessage as CallErrorMessage } from './errors/ErrorMessage';
import { ErrorMessage } from '../core';
import { HttpClientModule } from '../core/httpClient';
import { ValidationErrors } from './validators/validateCallData';
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
				sessionId: expectedSessionId,
				status: 200,
			});
		});
		const validExtension = 'e0';
		const validCalleeNumber = '+4915177777777';
		const validCallerId = '+4915122222222';

		const callData: CallData = {
			to: validCalleeNumber,
			from: validExtension,
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
			to: validCalleeNumber,
			from: invalidExtensionId,
			callerId: validCallerId,
		};

		await expect(callModule.initiate(callData)).rejects.toThrowError(
			ValidationErrors.INVALID_CALLER
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
			to: validCalleeNumber,
			from: validExtension,
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
			to: invalidCalleeNumber,
			from: validExtensionId,
			callerId: validCallerId,
		};

		await expect(callModule.initiate(callData)).rejects.toThrowError(
			ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER
		);
	});
});
