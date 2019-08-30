import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// tslint:disable-next-line:no-implicit-dependencies
import mockfs from 'mock-fs';
import { createHttpClient } from '../core/httpClient/httpClient';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { Fax } from '../core/models';
import validPDFBuffer from '../core/validator/validPDFBuffer';
import { createFaxModule, getUserFaxLines } from './fax';

let mockClient: HttpClientModule;

describe('Faxline ID List', () => {
  const mock = new MockAdapter(axios);
  const baseUrl = 'https://api.sipgate.com/v2';
  const httpClient = createHttpClient('testUsername@test.de', 'testPassword');
  beforeAll(() => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    mockClient = {} as HttpClientModule;
  });

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
      await getUserFaxLines(httpClient, mockUserID);
    }).not.toThrow();

    const userFaxLines = await getUserFaxLines(httpClient, mockUserID);
    expect(userFaxLines).toEqual(mockData.items);
  });

  test('should throw an exception', async () => {
    const mockUserID = '0000000';

    mockClient.get = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.reject({
          response: { data: { status: 404, message: 'resource not found' } },
        }),
      )
      .mockImplementationOnce(() =>
        Promise.reject({ response: { data: { status: 401 } } }),
      );

    await expect(getUserFaxLines(httpClient, mockUserID)).rejects.toThrow();
    await expect(getUserFaxLines(httpClient, mockUserID)).rejects.toThrow();
  });
});

describe('SendFax', () => {
  beforeAll(() => {
    mockfs({
      // prettier-ignore
      'path/to/valid.pdf': validPDFBuffer
    });

    // tslint:disable-next-line:no-object-literal-type-assertion
    mockClient = {} as HttpClientModule;

    // Used to make setTimeout call the passed callback immediately
    // @ts-ignore
    global.setTimeout = fn => fn();
  });

  afterAll(mockfs.restore);

  test('fax is sent', async () => {
    const faxModule = createFaxModule(mockClient);

    // @ts-ignore
    mockClient.post = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { sessionId: '123123' } }),
      );
    mockClient.get = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { faxStatusType: 'SENT' } }),
      );

    const fax: Fax = {
      faxlineId: 'f0',
      filename: './path/to/valid.pdf',
      recipient: '+4912368712',
    };

    await expect(faxModule.send(fax)).resolves.not.toThrow();
  });

  test('fax is sent without given faxline id', async () => {
    // @ts-ignore
    mockClient.post = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { sessionId: '123123' } }),
      );
    mockClient.get = jest
      .fn()
      .mockImplementationOnce(() => {
        return Promise.resolve({
          data: {
            domain: 'domain',
            locale: 'locale',
            masterSipId: 'masterSipId',
            sub: '123123',
          },
        });
      })
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { items: [{ id: '0' }, { id: '1' }] } }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { faxStatusType: 'SENT' } }),
      );

    const faxModule = createFaxModule(mockClient);

    const fax: Fax = {
      filename: './path/to/valid.pdf',
      recipient: '+4912368712',
    };

    await expect(faxModule.send(fax)).resolves.not.toThrow();
  });

  test('throws exception when fax status could not be fetched', async () => {
    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          sessionId: 123,
        },
        status: 200,
      });
    });

    mockClient.get = jest.fn().mockImplementationOnce(() => {
      return Promise.reject({
        response: {
          status: 404,
        },
      });
    });

    const faxModule = createFaxModule(mockClient);

    const faxToSend: Fax = {
      faxlineId: 'f0',
      filename: './path/to/valid.pdf',
      recipient: '+4912368712',
    };

    await expect(faxModule.send(faxToSend)).rejects.toThrowError(
      'Could not fetch the fax status',
    );
  });

  test('throws exception when fax status is failed', async () => {
    const faxModule = createFaxModule(mockClient);

    const faxToSend: Fax = {
      faxlineId: 'f0',
      filename: './path/to/valid.pdf',
      recipient: '+4912368712',
    };

    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          sessionId: 123,
        },
        status: 200,
      });
    });

    mockClient.get = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { faxStatusType: 'FAILED' } }),
      );

    await expect(faxModule.send(faxToSend)).rejects.toThrowError(
      'Could not fetch the fax status',
    );
  });
});
