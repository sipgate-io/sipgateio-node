import { detect as detectPlatform } from 'detect-browser';
import { sipgateIO } from './sipgateIOClient';
import { toBase64 } from '../../utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import packageJson from '../../../package.json';

describe('Test header', () => {
	const axiosMock = new MockAdapter(axios);
	const basicAuthHttpClient = sipgateIO({
		username: 'testUsername@test.de',
		password: 'testPassword',
	});

	afterEach(() => {
		axiosMock.resetHandlers();
	});

	const validOAuthToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmM2U3ZzI0NC0yNDQ3LTQ1ODctOWZjYy05ZWY1MjQ3aDE3NHMiLCJleHAiOjE1NDY2NTQ4MjcsIm5iZiI6MCwiaWF0IjoxNTY1NDgzMjE4LCJpc3MiOiJodHRwczovL2xvZ2luLnNpcGdhdGUuY29tL2F1dGgvcmVhbG1zL3RoaXJkLXBhcnR5Iiwic3ViIjoiZjoyZTc0ODY1Ny1mNTV6LTg5Z3MtOWdmMi1ydDU4MjRoMjQ1MTg6ODQ1Mjg0NiIsInR5cCI6IkJlYXJlciIsImF6cCI6InNpcGdhdGUtc3dhZ2dlci11aSIsIm5vbmNlIjoiOTgyMTU3MSIsImF1dGhfdGltZSI6MTU2NTQyODU0OCwic2Vzc2lvbl9zdGF0ZSI6Ijg1ZzR6MXM3LTc4ZzItNDM4NS05ZTFnLXIxODdmMjc0ZWQ5ayIsImFjciI6IjAiLCJzY29wZSI6ImFsbCJ9.axEQX90FLk4W89y92C9eQnwMV3wfewk5zaPCszj46YA';

	const oAuthHttpClient = sipgateIO({ token: validOAuthToken });

	test('test authorization header', async () => {
		const expectedData = 'test';
		const expectedAuthHeader = `Basic ${toBase64(
			'testUsername@test.de:testPassword'
		)}`;

		axiosMock.onGet('/test').reply((config) => {
			expect(config.headers.Authorization).toEqual(expectedAuthHeader);

			return [201, expectedData];
		});

		const response = await basicAuthHttpClient.get('/test');

		expect(response).toEqual(expectedData);
	});

	test('test oAuth authorization header', async () => {
		const expectedData = 'test';
		const expectedAuthHeader = `Bearer ${validOAuthToken}`;

		axiosMock.onGet('/test').reply((config) => {
			expect(config.headers.Authorization).toEqual(expectedAuthHeader);

			return [201, expectedData];
		});

		const response = await oAuthHttpClient.get('/test');

		expect(response).toEqual(expectedData);
	});

	test('x-header', async () => {
		const expectedData = 'test';
		const expectedXHeaderKey = 'X-Sipgate-Client';
		const expectedXHeaderValue = JSON.stringify(detectPlatform());

		axiosMock.onGet('/test').reply((config) => {
			expect(config.headers[expectedXHeaderKey]).toEqual(expectedXHeaderValue);

			return [201, expectedData];
		});

		const response = await basicAuthHttpClient.get('/test');
		expect(response).toEqual(expectedData);
	});

	test('test x-sipgate-client header', async () => {
		const expectedData = 'test';
		const expectedXVersionHeaderKey = 'X-Sipgate-Version';
		const expectedXVersionHeaderValue = packageJson.version;

		axiosMock.onGet('/test').reply((config) => {
			expect(config.headers[expectedXVersionHeaderKey]).toEqual(
				expectedXVersionHeaderValue
			);

			return [201, expectedData];
		});

		const response = await basicAuthHttpClient.get('/test');

		expect(response).toEqual(expectedData);
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
		const httpClient = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';

		mock.onGet('').reply(200, expectedData);

		const response = await httpClient.get('');
		expect(response).toBe(expectedData);
	});

	test('Test Valid URL Concatenation for Get Requests', async () => {
		const httpClient = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';

		mock.onGet(`${baseUrl}/sessions`).reply(200, expectedData);

		const response = await httpClient.get('/sessions');
		expect(response).toBe(expectedData);
	});

	test('Test Get Requests', async () => {
		const httpClient = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';

		mock.onGet(`${baseUrl}/sessions`).reply(204, expectedData);

		const response = await httpClient.get('/sessions');
		expect(response).toBe(expectedData);
	});

	test('Test Post to Post Mapping', async () => {
		const httpClient = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';
		const testData = { foo: 'bar' };
		mock.onPost('', testData).reply(200, expectedData);

		const response = await httpClient.post('', testData);
		expect(response).toBe(expectedData);
	});

	test('Test Put to Put Mapping', async () => {
		const httpClient = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';
		const testData = { foo: 'bar' };
		mock.onPut('', testData).reply(200, expectedData);

		const response = await httpClient.put('', testData);
		expect(response).toBe(expectedData);
	});

	test('Test Delete to Delete Mapping', async () => {
		const httpClient = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';
		mock.onDelete('').reply(200, expectedData);

		const response = await httpClient.delete('');
		expect(response).toBe(expectedData);
	});

	test('Test Patch to Patch Mapping', async () => {
		const httpClient = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const expectedData = 'test';
		const testData = { foo: 'bar' };
		mock.onPatch('', testData).reply(200, expectedData);

		const response = await httpClient.patch('', testData);
		expect(response).toBe(expectedData);
	});
});

describe('validation', () => {
	test('email', async () => {
		await expect(() =>
			sipgateIO({ username: 'testUsername', password: 'testPassword' })
		).toThrow('Invalid email');
	});
	test('password', async () => {
		await expect(() =>
			sipgateIO({ username: 'testUsername@test.d', password: '' })
		).toThrow('Invalid password');
	});
});

describe('The sipgateIOClient', () => {
	let mock: MockAdapter;

	beforeEach(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	test('should correctly deserialize dates in a flat response body', async () => {
		const client = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const response = {
			date: '2020-09-11T08:53:27Z',
		};

		mock.onGet().reply(200, response);

		const expected = {
			date: new Date(response.date),
		};

		await expect(client.get('/some-path')).resolves.toEqual(expected);
	});

	test('should not fail to deserialize a flat response body without a date', async () => {
		const client = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const response = {
			someString: 'not a date',
			someNumber: 42,
			someBoolean: false,
		};

		mock.onGet().reply(200, response);

		const expected = { ...response };

		await expect(client.get('/some-path')).resolves.toEqual(expected);
	});

	test('should correctly deserialize dates in a nested response body', async () => {
		const client = sipgateIO({
			username: 'testUsername@test.de',
			password: 'testPassword',
		});

		const response = {
			innerObject1: {
				date1: '2020-09-11T08:53:27Z',
			},
			innerObject2: {
				innerInnerObject21: {
					date2: '2020-04-20T08:53:27Z',
				},
			},
		};

		mock.onGet().reply(200, response);

		const expected = {
			innerObject1: {
				date1: new Date('2020-09-11T08:53:27Z'),
			},
			innerObject2: {
				innerInnerObject21: {
					date2: new Date('2020-04-20T08:53:27Z'),
				},
			},
		};

		await expect(client.get('/some-path')).resolves.toEqual(expected);
	});
});
