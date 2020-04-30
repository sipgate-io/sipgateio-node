/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule } from '../core/httpClient';
import { createHistoryModule } from './history';

describe('History Module', () => {
	let mockClient: HttpClientModule;

	beforeEach(() => {
		mockClient = {} as HttpClientModule;
	});

	it('validates the Extensions and throws an error including the message from the extension-validator', async () => {
		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchAll({ connectionIds: ['s0', 's1', 'sokx5', 's2'] })
		).rejects.toThrowError('Invalid extension: sokx5');
	});

	it('throws an error when the API answers with 404 Not Found', async () => {
		mockClient.get = jest.fn().mockImplementationOnce((_) => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchById('someUnknownEntryId')
		).rejects.toThrowError(ErrorMessage.HISTORY_EVENT_NOT_FOUND);
	});
	it('throws an error when the API answers with 400 Bad Request', async () => {
		mockClient.get = jest.fn().mockImplementationOnce((_) => {
			return Promise.reject({
				response: {
					status: 400,
				},
			});
		});

		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchAll({}, { limit: 100000 })
		).rejects.toThrowError(ErrorMessage.HISTORY_BAD_REQUEST);
	});
});
