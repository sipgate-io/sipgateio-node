import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import btoa from 'btoa';
import nock from 'nock';
import pjson from 'pjson';
import { createHttpClient } from './httpClient';

describe('Test header', () => {
  const baseUrl = 'https://api.sipgate.com/v2';
  const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

  test('test authorization header', async () => {
    const expectedData = 'test';
    const expectedAuthHeader = `Basic ${btoa(
      'testUsername@test.de:testPassword',
    )}`;

    nock(baseUrl)
      .matchHeader('Authorization', expectedAuthHeader)
      .get('/test')
      .reply(201, expectedData);

    const response = await httpClient.get('/test');
    const data = response.data;

    expect(data).toEqual(expectedData);
  });

  test('x-header', async () => {
    const expectedData = 'test';
    const expectedXHeaderKey = 'X-Sipgate-Client';
    const expectedXHeaderValue = 'lib-node';

    nock(baseUrl)
      .matchHeader(expectedXHeaderKey, expectedXHeaderValue)
      .get('/test')
      .reply(201, expectedData);

    const response = await httpClient.get('/test');
    const data = response.data;

    expect(data).toEqual(expectedData);
  });

  test('test x-sipgate-client header', async () => {
    const expectedData = 'test';
    const expectedXVersionHeaderKey = 'X-Sipgate-Version';
    const expectedXVersionHeaderValue = pjson.version;

    nock(baseUrl)
      .matchHeader(expectedXVersionHeaderKey, expectedXVersionHeaderValue)
      .get('/test')
      .reply(201, expectedData);

    const response = await httpClient.get('/test');
    const data = response.data;

    expect(data).toEqual(expectedData);
  });
});

describe('Test wrapper methods', () => {
  const mock = new MockAdapter(axios);
  const baseUrl = 'https://api.sipgate.com/v2';

  beforeEach(() => {
    mock.reset();
  });

  test('Test Get to Get Mapping', async () => {
    const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

    const expectedData = 'test';

    mock.onGet('').reply(200, expectedData);

    const response = await httpClient.get('');
    expect(response.data).toBe(expectedData);
  });

  test('Test Valid URL Concatenation for Get Requests', async () => {
    const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

    const expectedData = 'test';

    mock.onGet(`${baseUrl}/sessions`).reply(200, expectedData);

    const response = await httpClient.get('/sessions');
    expect(response.data).toBe(expectedData);
  });

  test('Test Get Requests', async () => {
    const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

    const expectedData = 'test';

    mock.onGet(`${baseUrl}/sessions`).reply(204, expectedData);

    const response = await httpClient.get('/sessions');
    expect(response.data).toBe(expectedData);
  });

  test('Test Post to Post Mapping', async () => {
    const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

    const expectedData = 'test';
    const testData = { foo: 'bar' };
    mock.onPost('', testData).reply(200, expectedData);

    const response = await httpClient.post('', testData);
    expect(response.data).toBe(expectedData);
  });

  test('Test Put to Put Mapping', async () => {
    const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

    const expectedData = 'test';
    const testData = { foo: 'bar' };
    mock.onPut('', testData).reply(200, expectedData);

    const response = await httpClient.put('', testData);
    expect(response.data).toBe(expectedData);
  });

  test('Test Delete to Delete Mapping', async () => {
    const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

    const expectedData = 'test';
    mock.onDelete('').reply(200, expectedData);

    const response = await httpClient.delete('');
    expect(response.data).toBe(expectedData);
  });

  test('Test Patch to Patch Mapping', async () => {
    const httpClient = createHttpClient('testUsername@test.de', 'testPassword');

    const expectedData = 'test';
    const testData = { foo: 'bar' };
    mock.onPatch('', testData).reply(200, expectedData);

    const response = await httpClient.patch('', testData);
    expect(response.data).toBe(expectedData);
  });
});

describe('validation', () => {
  test('email', async () => {
    await expect(() =>
      createHttpClient('testUsername', 'testPassword'),
    ).toThrow('Invalid email');
  });
  test('password', async () => {
    await expect(() => createHttpClient('testUsername@test.d', '')).toThrow(
      'Invalid password - contains " "',
    );
  });
});
