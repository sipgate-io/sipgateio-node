/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorMessage } from './errors/ErrorMessage';
import { HistoryEntry } from './history.types';
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

	it('batchUpdates historyUpdates which include no note', async () => {
		mockClient.put = jest.fn().mockImplementation((path, args) => {
			return Promise.resolve({
				status: 200,
			});
		});

		const historyModule = createHistoryModule(mockClient);

		const events: HistoryEntry[] = [
			({ id: '1' } as unknown) as HistoryEntry,
			({ id: '2' } as unknown) as HistoryEntry,
			({ id: '3' } as unknown) as HistoryEntry,
			({ id: '4' } as unknown) as HistoryEntry,
			({ id: '5' } as unknown) as HistoryEntry,
		];

		await expect(
			historyModule.batchUpdateEvents(events, (evt) => {
				if (evt.id === '3' || evt.id === '4') {
					return { note: 'Note Event' };
				}
				return {
					starred: true,
				};
			})
		).resolves.not.toThrow();

		expect(mockClient.put).toHaveBeenCalledWith('history', [
			{ id: '1', starred: true },
			{ id: '2', starred: true },
			{ id: '5', starred: true },
		]);
		expect(mockClient.put).toHaveBeenCalledWith('history/3', {
			id: undefined,
			note: 'Note Event',
		});
		expect(mockClient.put).toHaveBeenCalledWith('history/4', {
			id: undefined,
			note: 'Note Event',
		});
		expect(mockClient.put).toHaveBeenCalledTimes(3);
	});
});
