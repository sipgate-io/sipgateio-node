import { createClient } from './sipgateClient';

describe('sipgateClient tests', () => {
	test('check object', () => {
		const client = createClient({
			username: 'test@test.com',
			password: 'test',
		});
		expect(client).toHaveProperty('sms');
	});
});
