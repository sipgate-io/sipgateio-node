import { HistoryEntry, HistoryEntryType, Starred } from './history.types';
import { HistoryErrorMessage } from './errors/handleHistoryError';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { createHistoryModule } from './history';

describe('History Module', () => {
	let mockClient: SipgateIOClient;

	beforeEach(() => {
		mockClient = {} as SipgateIOClient;
	});

	it('validates the Extensions and throws an error including the message from the extension-validator', async () => {
		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchAll({ connectionIds: ['s0', 's1', 'sokx5', 's2'] })
		).rejects.toThrowError('Invalid extension: sokx5');
	});

	it('throws an error when the API answers with 404 Not Found', async () => {
		mockClient.get = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchById('someUnknownEntryId')
		).rejects.toThrowError(HistoryErrorMessage.EVENT_NOT_FOUND);
	});

	it('throws an error when the API answers with 400 Bad Request', async () => {
		mockClient.get = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 400,
				},
			});
		});

		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.fetchAll({}, { limit: 100000 })
		).rejects.toThrowError(HistoryErrorMessage.BAD_REQUEST);
	});

	it('batchUpdates historyUpdates which include no note', async () => {
		mockClient.put = jest.fn().mockImplementation(() => {
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

	it('throws an error when a connection id is invalid', async () => {
		const historyModule = createHistoryModule(mockClient);

		await expect(
			historyModule.exportAsCsvString({ connectionIds: ['s0', 'sokx5', 'e0'] })
		).rejects.toThrowError('Invalid extension: sokx5');
	});

	it('passes the filter to the history export endpoint', async () => {
		const historyModule = createHistoryModule(mockClient);
		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve('example response'));

		await historyModule.exportAsCsvString(
			{
				archived: true,
				types: [HistoryEntryType.SMS],
			},
			{ offset: 10, limit: 20 }
		);

		expect(mockClient.get).toBeCalledWith('/history/export', {
			params: {
				archived: true,
				types: [HistoryEntryType.SMS],
				offset: 10,
				limit: 20,
			},
		});
	});

	it('accepts and remaps a starred boolean for the filter to the history export endpoint', async () => {
		const historyModule = createHistoryModule(mockClient);
		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve('example response'));

		await historyModule.exportAsCsvString({ starred: true });

		expect(mockClient.get).toBeCalledWith('/history/export', {
			params: {
				starred: Starred.STARRED,
			},
		});
	});
});
