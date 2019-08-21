import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createHttpClient } from '../core/httpClient/httpClient';
import { getUserFaxlines, getUserInfo } from './fax';

describe('MasterSipID', () => {
  const instance = axios.create();
  const mock = new MockAdapter(instance);
  // const faxModule = createFaxModule(instance);

  beforeEach(() => {
    mock.reset();
  });

  test('should get webuser ID', () => {
    mock.onGet('authorization/userinfo').reply(200, '');

    expect(async () => {
      await getUserInfo(instance);
    }).not.toThrow();
  });
});

describe('Faxline ID List', () => {
  const mock = new MockAdapter(axios);
  const baseUrl = 'https://api.sipgate.com/v2';
  const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

  beforeEach(() => {
    mock.reset();
  });

  test('should get faxline ID LIST', async () => {
    const mockUserID = '0000000';
    const mockData = {
      items: [
        {
          alias: "Alexander Bain's fax",
          canReceive: false,
          canSend: false,
          id: 'f0',
          tagline: 'Example Ltd.',
        },
      ],
    };

    mock.onGet(`${baseUrl}/${mockUserID}/faxlines`).reply(200, mockData);

    expect(async () => {
      await getUserFaxlines(httpClient, mockUserID);
    }).not.toThrow();

    const userFaxLines = await getUserFaxlines(httpClient, mockUserID);
    expect(userFaxLines).toEqual(mockData.items);
  });
});
