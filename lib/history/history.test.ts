/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule } from '../core/httpClient';
import { createHistoryModule } from './history';

describe('History Module', () => {
	let mockClient: HttpClientModule;

	beforeAll(() => {
		mockClient = {} as HttpClientModule;
		mockClient.get = jest
			.fn()
			.mockImplementationOnce((_) => {
				return Promise.reject({
					response: {
						status: 404,
					},
				});
			})
			.mockImplementationOnce((_) => {
				return Promise.reject({
					response: {
						status: 400,
					},
				});
			});
	});

	it('validates the Extensions and throws an error including the message from the extension-validator', async () => {
		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchAll({ connectionIds: ['s0', 's1', 'sokx5', 's2'] })
		).rejects.toThrowError('Invalid extension: sokx5');
	});

	it('returns an exception except 404.NotFound when an invalid historyEntryId is supplied', async () => {
		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchById('invalidEntryId')
		).rejects.toThrowError(ErrorMessage.HISTORY_EVENT_NOT_FOUND);
	});
	it('returns an exception except 400.BadRequest when an invalid historyEntryId is supplied', async () => {
		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchAll({}, { limit: 100000 })
		).rejects.toThrowError(ErrorMessage.HISTORY_BAD_REQUEST);
	});
});
