import { createClient } from './sipgateClient';

describe('sipgateClient tests', () => {
  test('check object', () => {
    const client = createClient('test@test.com', 'test');
    expect(client).toHaveProperty('sms');
  });
});
