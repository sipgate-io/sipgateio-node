import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getUserInfo } from './fax';

describe('Webuser Id', () => {
  const instance = axios.create();
  const mock = new MockAdapter(instance);
  // const faxModule = createFaxModule(instance);

  beforeEach(() => {
    mock.reset();
  });

  test('should get webuser id', () => {
    mock.onGet('authorization/userinfo').reply(200, '');

    expect(async () => {
      await getUserInfo(instance);
    }).not.toThrow();
  });
});
