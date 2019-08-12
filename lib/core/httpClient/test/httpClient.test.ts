import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import { BASE_URL, HttpClient } from '../httpClient';

const mock = new axiosMock(axios);

describe('Test Get Method', () => {
  test('Test Get to Get Mapping', async () => {
    const httpClient = new HttpClient('testUsername', 'testPassword');

    mock.onGet('').reply(200);

    const response = await httpClient.get('');
    expect(response.status).toBe(200);
  });

  test('Test Valid URL Concatenation', async () => {
    const httpClient = new HttpClient('testUsername', 'testPassword');

    mock.onGet(`${BASE_URL}/sessions`).reply(200);

    const response = await httpClient.get('/sessions');
    expect(response.status).toBe(200);
  });
});
