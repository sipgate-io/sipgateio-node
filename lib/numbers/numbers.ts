import { NumberResponse, NumbersModule } from './numbers.types';
import { Pagination } from '../core';
import { SipgateIOClient } from '..';
import { handleNumbersError } from './errors/handleNumbersError';

export const createNumbersModule = (
	client: SipgateIOClient
): NumbersModule => ({
	async getAllNumbers(pagination?: Pagination): Promise<NumberResponse> {
		return client
			.get<NumberResponse>('/numbers', {
				params: {
					...pagination,
				},
			})
			.catch((error) => Promise.reject(handleNumbersError(error)));
	},
});
