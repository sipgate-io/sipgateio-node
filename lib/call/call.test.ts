import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { ClickToDial } from '../core/models/call.model';
import { createCallModule } from './call';
import { CallModule } from './call.module';

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
					sessionId: expectedSessionId
				},
				status: 200
			});
		});
		const validExtension = 'e0';
		const validCalleeNumber = '+49123456789123';
		const validCallerId = '+49123456789';

		const clickToDial: ClickToDial = {
			callee: validCalleeNumber,
			caller: validExtension,
			callerId: validCallerId
		};

		await expect(callModule.initiate(clickToDial)).resolves.not.toThrow();

		const { sessionId } = await callModule.initiate(clickToDial);
		expect(sessionId).toEqual(expectedSessionId);
	});

	it('should throw an exception for malformed extension', async () => {
		const invalidExtensionId = 'e-18';
		const validCalleeNumber = '+49123456789123';
		const validCallerId = '+49123456789';

		const clickToDial: ClickToDial = {
			callee: validCalleeNumber,
			caller: invalidExtensionId,
			callerId: validCallerId
		};

		await expect(callModule.initiate(clickToDial)).rejects.toThrow(
			ErrorMessage.VALIDATOR_INVALID_EXTENSION
		);
	});

	it('should throw an exception for insufficient funds', async () => {
		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 402
				}
			});
		});

		const validExtension = 'e8';
		const validCalleeNumber = '+49123456789123';
		const validCallerId = '+49123456789';

		const clickToDial: ClickToDial = {
			callee: validCalleeNumber,
			caller: validExtension,
			callerId: validCallerId
		};

		await expect(callModule.initiate(clickToDial)).rejects.toThrow(
			ErrorMessage.CALL_INSUFFICIENT_FUNDS
		);
	});

	it('should throw a validation exception for malformed callee number ', async () => {
		const validExtensionId = 'e0';
		const invalidCalleeNumber = 'not a phone number';
		const validCallerId = '+494567787889';

		const clickToDial: ClickToDial = {
			callee: invalidCalleeNumber,
			caller: validExtensionId,
			callerId: validCallerId
		};

		await expect(callModule.initiate(clickToDial)).rejects.toThrow(
			`${ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER}: callee`
		);
	});
});
