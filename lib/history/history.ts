import {
	BaseHistoryFilter,
	HistoryEntry,
	HistoryEntryType,
	HistoryEntryUpdateOptionsWithId,
	HistoryFilterDTO,
	HistoryModule,
	HistoryResponse,
	HistoryResponseItem,
	Starred,
	StarredDTO,
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
			starred: mapStarredToDTO(filter.starred),
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
			.then((response) => response.items.map(transformHistoryEntry))
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

		const starred: Starred | undefined = filter.starred === true ? Starred.STARRED : filter.starred === false ? Starred.UNSTARRED : filter.starred;
		const historyFilterDTO: HistoryFilterDTO = {
			archived: filter.archived,
			connectionIds: filter.connectionIds,
			directions: filter.directions,
			from: filter.startDate,
			starred: mapStarredToDTO(filter.starred),
			to: filter.endDate,
			types: filter.types,
		};

		return client
			.get<string>('/history/export', {
				params: {
					...historyFilterDTO,
					...pagination,
				},
			})
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

const transformHistoryEntry = (entry: HistoryResponseItem): HistoryEntry => {
	if (entry.type === HistoryEntryType.FAX) {
		const { faxStatusType, ...rest } = entry;
		return { ...rest, faxStatus: faxStatusType };
	}

	return entry;
};

function mapStarredToDTO(starred: boolean | Starred | undefined): StarredDTO | undefined {
	switch (starred) {
		case true:
		case Starred.STARRED:
			return StarredDTO.STARRED;

		case false:
		case Starred.UNSTARRED:
			return StarredDTO.UNSTARRED;

		case undefined:
			return undefined;
	}
}
