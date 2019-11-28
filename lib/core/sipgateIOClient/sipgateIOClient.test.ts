import { sipgateIO } from './sipgateIOClient';

describe('sipgateIOClient tests', () => {
	test('check object', () => {
		const client = sipgateIO({
			username: 'test@test.com',
			password: 'test',
		});
		expect(client).toHaveProperty('sms');
	});
});
