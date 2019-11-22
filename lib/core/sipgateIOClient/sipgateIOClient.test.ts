import { createClient } from './sipgateIOClient';

describe('sipgateIOClient tests', () => {
	test('check object', () => {
		const client = createClient({
			username: 'test@test.com',
			password: 'test',
		});
		expect(client).toHaveProperty('sms');
	});
});
