import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import btoa from 'btoa';
import { BASE_URL, HttpClient } from '../httpClient';

describe('Test Get Method', () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
  });

  test('Test Get to Get Mapping', async () => {
    const httpClient = new HttpClient('testUsername', 'testPassword');

    const expectedData = 'test';

    mock.onGet('').reply(200, expectedData);

    const response = await httpClient.get('');
    expect(response.data).toBe(expectedData);
  });

  test('Test Valid URL Concatenation', async () => {
    const httpClient = new HttpClient('testUsername', 'testPassword');

    const expectedData = 'test';

    mock.onGet(`${BASE_URL}/sessions`).reply(200, expectedData);

    const response = await httpClient.get('/sessions');
    expect(response.data).toBe(expectedData);
  });

  test('test headers', async () => {
    const httpClient = new HttpClient('testUsername', 'testPassword');
    const client = Reflect.get(httpClient, 'client') as AxiosInstance;
    const headers = client.defaults.headers;

    const expectedXHeaderKey = 'X-Sipgate-Client';
    const expectedXHeaderValue = 'lib-node';

    const expectedXVersionHeaderKey = 'X-Sipgate-Version';
    const expectedXVersionHeaderValue = '0.0.0';

    const expectedAuthHeader = `Basic ${btoa('testUsername:testPassword')}`;

    expect(headers.Authorization).toEqual(expectedAuthHeader);
    expect(headers[expectedXHeaderKey]).toEqual(expectedXHeaderValue);
    expect(headers[expectedXVersionHeaderKey]).toEqual(
      expectedXVersionHeaderValue,
    );
  });
});
