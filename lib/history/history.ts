import { ErrorMessage } from '../history/errors/ErrorMessage';
import { HistoryEntry, HistoryModule, HistoryResponse } from './history.types';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { handleCoreError } from '../core';
import qs from 'qs';

export const createHistoryModule = (
	client: HttpClientModule
): HistoryModule => ({
	async fetchAll(filter, pagination): Promise<HistoryEntry[]> {
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
});

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(ErrorMessage.HISTORY_BAD_REQUEST);
	}

	return handleCoreError(error);
};
