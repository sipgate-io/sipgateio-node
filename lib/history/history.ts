import { HistoryEntry, HistoryModule, HistoryResponse } from './history.types';
import { HttpClientModule } from '../core/httpClient';
import qs from 'qs';

export const createHistoryModule = (
	client: HttpClientModule
): HistoryModule => ({
	async fetchAll(filter, pagination): Promise<HistoryEntry[]> {
		const {
			data: { items },
		} = await client.get<HistoryResponse>('/history', {
			params: {
				...filter,
				...pagination,
			},
			paramsSerializer: params =>
				qs.stringify(params, { arrayFormat: 'repeat' }),
		});

		return items;
	},
	async fetchById(entryId): Promise<HistoryEntry> {
		const { data } = await client.get<HistoryEntry>(`/history/${entryId}`);

		return data;
	},
});
