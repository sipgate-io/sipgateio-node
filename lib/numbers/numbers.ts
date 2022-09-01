import { NumberResponseItem, NumbersModule } from './numbers.types';
import { Pagination } from '../core';
import { SipgateIOClient } from '..';
import { handleNumbersError } from './errors/handleNumbersError';

export const createNumbersModule = (
	client: SipgateIOClient
): NumbersModule => ({
	async getAllNumbers(pagination?: Pagination): Promise<NumberResponseItem[]> {
		return client
			.get<{ items: NumberResponseItem[] }>('/numbers', {
				params: {
					...pagination,
				},
			})
			.then((response) => response.items)
			.catch((error) => Promise.reject(handleNumbersError(error)));
	},
});
