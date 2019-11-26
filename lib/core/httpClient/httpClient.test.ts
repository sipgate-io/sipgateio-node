import { createHttpClient } from './httpClient';
import { detect as detectPlatform } from 'detect-browser';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import btoa from 'btoa';
import nock from 'nock';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import packageJson from '../../../package.json';
import validOAuthToken from '../validator/validOAuthToken';

describe('Test header', () => {
	const baseUrl = 'https://api.sipgate.com/v2';
	const basicAuthHttpClient = createHttpClient({
		username: 'testUsername@test.de',
		password: 'testPassword',
	});
	const oAuthHttpClient = createHttpClient({ token: validOAuthToken });

	test('test authorization header', async () => {
		const expectedData = 'test';
		const expectedAuthHeader = `Basic ${btoa(
			'testUsername@test.de:testPassword'
		)}`;

		nock(baseUrl)
			.matchHeader('Authorization', expectedAuthHeader)
			.get('/test')
			.reply(201, expectedData);

		const response = await basicAuthHttpClient.get('/test');
		const { data } = response;

		expect(data).toEqual(expectedData);
	});

	test('test oAuth authorization header', async () => {
		const expectedData = 'test';
		const expectedAuthHeader = `Bearer ${validOAuthToken}`;

		nock(baseUrl)
			.matchHeader('Authorization', expectedAuthHeader)
			.get('/test')
			.reply(201, expectedData);

		const response = await oAuthHttpClient.get('/test');
		const { data } = response;

		expect(data).toEqual(expectedData);
	});

	test('x-header', async () => {
		const expectedData = 'test';
		const expectedXHeaderKey = 'X-Sipgate-Client';
		const expectedXHeaderValue = JSON.stringify(detectPlatform());

		nock(baseUrl)
			.matchHeader(expectedXHeaderKey, expectedXHeaderValue)
			.get('/test')
			.reply(201, expectedData);

		const response = await basicAuthHttpClient.get('/test');
		const { data } = response;

		expect(data).toEqual(expectedData);
	});

	test('test x-sipgate-client header', async () => {
		const expectedData = 'test';
		const expectedXVersionHeaderKey = 'X-Sipgate-Version';
		const expectedXVersionHeaderValue = packageJson.version;

		nock(baseUrl)
			.matchHeader(expectedXVersionHeaderKey, expectedXVersionHeaderValue)
			.get('/test')
			.reply(201, expectedData);

		const response = await basicAuthHttpClient.get('/test');
		const { data } = response;

		expect(data).toEqual(expectedData);
	});
});

describe('Test wrapper methods', () => {
	let mock: MockAdapter;
	const baseUrl = 'https://api.sipgate.com/v2';

	beforeEach(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	test('Test Get to Get Mapping', async () => {
		const httpClient = createHttpClient({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';

		mock.onGet('').reply(200, expectedData);

		const response = await httpClient.get('');
		expect(response.data).toBe(expectedData);
	});

	test('Test Valid URL Concatenation for Get Requests', async () => {
		const httpClient = createHttpClient({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';

		mock.onGet(`${baseUrl}/sessions`).reply(200, expectedData);

		const response = await httpClient.get('/sessions');
		expect(response.data).toBe(expectedData);
	});

	test('Test Get Requests', async () => {
		const httpClient = createHttpClient({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';

		mock.onGet(`${baseUrl}/sessions`).reply(204, expectedData);

		const response = await httpClient.get('/sessions');
		expect(response.data).toBe(expectedData);
	});

	test('Test Post to Post Mapping', async () => {
		const httpClient = createHttpClient({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';
		const testData = { foo: 'bar' };
		mock.onPost('', testData).reply(200, expectedData);

		const response = await httpClient.post('', testData);
		expect(response.data).toBe(expectedData);
	});

	test('Test Put to Put Mapping', async () => {
		const httpClient = createHttpClient({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';
		const testData = { foo: 'bar' };
		mock.onPut('', testData).reply(200, expectedData);

		const response = await httpClient.put('', testData);
		expect(response.data).toBe(expectedData);
	});

	test('Test Delete to Delete Mapping', async () => {
		const httpClient = createHttpClient({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';
		mock.onDelete('').reply(200, expectedData);

		const response = await httpClient.delete('');
		expect(response.data).toBe(expectedData);
	});

	test('Test Patch to Patch Mapping', async () => {
		const httpClient = createHttpClient({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

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
			createHttpClient({ username: 'testUsername', password: 'testPassword' })
		).toThrow('Invalid email');
	});
	test('password', async () => {
		await expect(() =>
			createHttpClient({ username: 'testUsername@test.d', password: '' })
		).toThrow('Invalid password');
	});
});
