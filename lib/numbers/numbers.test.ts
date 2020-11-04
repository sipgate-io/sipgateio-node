import { NumberResponseItemType, createNumbersModule } from '.';
import { NumbersErrorMessage } from './errors/handleNumbersError';
import { SipgateIOClient } from '../core';

describe('Number Module', () => {
	let mockClient: SipgateIOClient;

	beforeEach(() => {
		mockClient = {} as SipgateIOClient;
	});

	it('returns all number items', async () => {
		mockClient.get = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({
				items: [
					{
						id: '12355',
						number: '+49157391234567',
						localized: '15739123456',
						type: NumberResponseItemType.INTERNATIONAL,
						endpointId: 'string',
						endpointAlias: 'string',
						endpointUrl: 'string',
					},
					{
						id: '41351',
						number: '+49145169146',
						localized: '145169146',
						type: NumberResponseItemType.LANDLINE,
						endpointId: 'string',
						endpointAlias: 'string',
						endpointUrl: 'string',
					},
				],
			});
		});

		const numberModule = createNumbersModule(mockClient);
		const actualValues = await numberModule.getAllNumbers();
		await expect(actualValues).toStrictEqual({
			items: [
				{
					id: '12355',
					number: '+49157391234567',
					localized: '15739123456',
					type: NumberResponseItemType.INTERNATIONAL,
					endpointId: 'string',
					endpointAlias: 'string',
					endpointUrl: 'string',
				},
				{
					id: '41351',
					number: '+49145169146',
					localized: '145169146',
					type: NumberResponseItemType.LANDLINE,
					endpointId: 'string',
					endpointAlias: 'string',
					endpointUrl: 'string',
				},
			],
		});
	});

	it('throws an error when the API answers with 400 Bad Request', async () => {
		mockClient.get = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 400,
				},
			});
		});

		const numberModule = createNumbersModule(mockClient);

		await expect(numberModule.getAllNumbers()).rejects.toThrowError(
			NumbersErrorMessage.BAD_REQUEST
		);
	});
});
