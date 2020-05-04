import { ErrorMessage } from './errors/ErrorMessage';
import { HistoryEntry, HistoryModule, HistoryResponse } from './history.types';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { handleCoreError } from '../core';
import { validateExtension } from '../core/validator';
import qs from 'qs';

export const createHistoryModule = (
	client: HttpClientModule
): HistoryModule => ({
	async fetchAll(filter, pagination): Promise<HistoryEntry[]> {
		if (filter && filter.connectionIds) {
			const result = filter.connectionIds
				.map((id) => validateExtension(id))
				.find((validationResult) => validationResult.isValid === false);
			if (result && result.isValid === false) {
				throw new Error(result.cause);
			}
		}

		return await client
			.get<HistoryResponse>('/history', {
				params: {
					...filter,
					...pagination,
				},
				paramsSerializer: (params) =>
					qs.stringify(params, { arrayFormat: 'repeat' }),
			})
			.then((response) => response.data.items)
			.catch((error) => Promise.reject(handleError(error)));
	},
	async fetchById(entryId): Promise<HistoryEntry> {
		return await client
			.get<HistoryEntry>(`/history/${entryId}`)
			.then((response) => response.data)
			.catch((error) => Promise.reject(handleError(error)));
	},
	async deleteById(entryId): Promise<void> {
		await client
			.delete<string>(`/history/${entryId}`)
			.catch((error) => Promise.reject(handleError(error)));
	},
	async deleteByListOfIds(entryIds): Promise<void> {
		await client
			.delete<string>(`/history`, {
				params: {
					id: entryIds,
				},
				paramsSerializer: (params) =>
					qs.stringify(params, { arrayFormat: 'repeat' }),
			})
			.catch((error) => Promise.reject(handleError(error)));
	},
});

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(ErrorMessage.HISTORY_BAD_REQUEST);
	}

	if (error.response && error.response.status === 404) {
		return new Error(ErrorMessage.HISTORY_EVENT_NOT_FOUND);
	}

	return handleCoreError(error);
};
