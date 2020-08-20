import {
	BaseHistoryFilter,
	HistoryEntry,
	HistoryEntryUpdateOptionsWithId,
	HistoryFilterDTO,
	HistoryModule,
	HistoryResponse,
} from './history.types';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { handleHistoryError } from './errors/handleHistoryError';
import { validateExtension } from '../core/validator';

export const createHistoryModule = (
	client: SipgateIOClient
): HistoryModule => ({
	async fetchAll(filter = {}, pagination): Promise<HistoryEntry[]> {
		validateFilteredExtension(filter);

		const historyFilterDTO: HistoryFilterDTO = {
			archived: filter.archived,
			connectionIds: filter.connectionIds,
			directions: filter.directions,
			from: filter.startDate,
			starred: filter.starred,
			to: filter.endDate,
			types: filter.types,
		};

		return client
			.get<HistoryResponse>('/history', {
				params: {
					...historyFilterDTO,
					...pagination,
				},
			})
			.then((response) => response.items)
			.catch((error) => Promise.reject(handleHistoryError(error)));
	},
	fetchById(entryId): Promise<HistoryEntry> {
		return client
			.get<HistoryEntry>(`/history/${entryId}`)
			.catch((error) => Promise.reject(handleHistoryError(error)));
	},
	async deleteById(entryId): Promise<void> {
		await client
			.delete<string>(`/history/${entryId}`)
			.catch((error) => Promise.reject(handleHistoryError(error)));
	},
	async deleteByListOfIds(entryIds): Promise<void> {
		await client
			.delete<string>(`/history`, {
				params: {
					id: entryIds,
				},
			})
			.catch((error) => Promise.reject(handleHistoryError(error)));
	},
	async batchUpdateEvents(events, callback): Promise<void> {
		const mappedEvents = events.map((event) => {
			return {
				id: event.id,
				...callback(event),
			};
		});

		const eventsToModify = mappedEvents.filter(
			(eventUpdate) => Object.keys(eventUpdate).length > 1
		);

		const eventsWithNote: HistoryEntryUpdateOptionsWithId[] = [];
		const eventsWithoutNote: HistoryEntryUpdateOptionsWithId[] = [];

		eventsToModify.forEach((event) => {
			if (event.note === undefined) {
				eventsWithoutNote.push(event);
			} else {
				eventsWithNote.push(event);
			}
		});

		await Promise.all([
			...eventsWithNote.map((event) =>
				client.put(`history/${event.id}`, {
					...event,
					id: undefined,
				})
			),
			client.put('history', eventsWithoutNote),
		]).catch((error) => Promise.reject(handleHistoryError(error)));
	},
	async exportAsCsvString(filter = {}, pagination): Promise<string> {
		validateFilteredExtension(filter);

		const historyFilterDTO: HistoryFilterDTO = {
			archived: filter.archived,
			connectionIds: filter.connectionIds,
			directions: filter.directions,
			from: filter.startDate,
			starred: filter.starred,
			to: filter.endDate,
			types: filter.types,
		};

		return client
			.get('/history/export', {
				params: {
					...historyFilterDTO,
					...pagination,
				},
			})
			.then((response) => response.data)
			.catch((error) => Promise.reject(handleHistoryError(error)));
	},
});

const validateFilteredExtension = (filter?: BaseHistoryFilter): void => {
	if (filter && filter.connectionIds) {
		const result = filter.connectionIds
			.map((id) => validateExtension(id))
			.find((validationResult) => validationResult.isValid === false);
		if (result && result.isValid === false) {
			throw new Error(result.cause);
		}
	}
};
