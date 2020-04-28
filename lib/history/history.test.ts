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
});
