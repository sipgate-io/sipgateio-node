import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// tslint:disable-next-line:no-implicit-dependencies
import mockfs from 'mock-fs';
import { createHttpClient } from '../core/httpClient/httpClient';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { Fax } from '../core/models';
import { createFaxModule, getUserFaxLines } from './fax';

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
      await getUserFaxLines(httpClient, mockUserID);
    }).not.toThrow();

    const userFaxLines = await getUserFaxLines(httpClient, mockUserID);
    expect(userFaxLines).toEqual(mockData.items);
  });
});

describe('SendFax', () => {
  beforeAll(() => {
    mockfs({
      // prettier-ignore
      'path/to/valid.pdf': Buffer.from([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 195, 164, 195, 188, 195, 182, 195, 159, 10, 50, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 76, 101, 110, 103, 116, 104, 32, 51, 32, 48, 32, 82, 47, 70, 105, 108, 116, 101, 114, 47, 70, 108, 97, 116, 101, 68, 101, 99, 111, 100, 101, 62, 62, 10, 115, 116, 114, 101, 97, 109, 10, 120, 156, 51, 208, 51, 84, 40, 231, 42, 84, 48, 0, 66, 51, 67, 35, 5, 115, 75, 35, 133, 162, 84, 174, 112, 45, 133, 60, 174, 64, 5, 0, 95, 170, 6, 72, 10, 101, 110, 100, 115, 116, 114, 101, 97, 109, 10, 101, 110, 100, 111, 98, 106, 10, 10, 51, 32, 48, 32, 111, 98, 106, 10, 51, 54, 10, 101, 110, 100, 111, 98, 106, 10, 10, 53, 32, 48, 32, 111, 98, 106, 10, 60, 60, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 54, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 70, 111, 110, 116, 32, 53, 32, 48, 32, 82, 10, 47, 80, 114, 111, 99, 83, 101, 116, 91, 47, 80, 68, 70, 47, 84, 101, 120, 116, 93, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 49, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 47, 80, 97, 103, 101, 47, 80, 97, 114, 101, 110, 116, 32, 52, 32, 48, 32, 82, 47, 82, 101, 115, 111, 117, 114, 99, 101, 115, 32, 54, 32, 48, 32, 82, 47, 77, 101, 100, 105, 97, 66, 111, 120, 91, 48, 32, 48, 32, 54, 49, 49, 46, 57, 55, 49, 54, 53, 51, 53, 52, 51, 51, 48, 55, 32, 55, 57, 49, 46, 57, 55, 49, 54, 53, 51, 53, 52, 51, 51, 48, 55, 93, 47, 71, 114, 111, 117, 112, 60, 60, 47, 83, 47, 84, 114, 97, 110, 115, 112, 97, 114, 101, 110, 99, 121, 47, 67, 83, 47, 68, 101, 118, 105, 99, 101, 82, 71, 66, 47, 73, 32, 116, 114, 117, 101, 62, 62, 47, 67, 111, 110, 116, 101, 110, 116, 115, 32, 50, 32, 48, 32, 82, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 52, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 47, 80, 97, 103, 101, 115, 10, 47, 82, 101, 115, 111, 117, 114, 99, 101, 115, 32, 54, 32, 48, 32, 82, 10, 47, 77, 101, 100, 105, 97, 66, 111, 120, 91, 32, 48, 32, 48, 32, 54, 49, 49, 32, 55, 57, 49, 32, 93, 10, 47, 75, 105, 100, 115, 91, 32, 49, 32, 48, 32, 82, 32, 93, 10, 47, 67, 111, 117, 110, 116, 32, 49, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 55, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 84, 121, 112, 101, 47, 67, 97, 116, 97, 108, 111, 103, 47, 80, 97, 103, 101, 115, 32, 52, 32, 48, 32, 82, 10, 47, 79, 112, 101, 110, 65, 99, 116, 105, 111, 110, 91, 49, 32, 48, 32, 82, 32, 47, 88, 89, 90, 32, 110, 117, 108, 108, 32, 110, 117, 108, 108, 32, 48, 93, 10, 47, 76, 97, 110, 103, 40, 101, 110, 45, 85, 83, 41, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 56, 32, 48, 32, 111, 98, 106, 10, 60, 60, 47, 67, 114, 101, 97, 116, 111, 114, 60, 70, 69, 70, 70, 48, 48, 53, 55, 48, 48, 55, 50, 48, 48, 54, 57, 48, 48, 55, 52, 48, 48, 54, 53, 48, 48, 55, 50, 62, 10, 47, 80, 114, 111, 100, 117, 99, 101, 114, 60, 70, 69, 70, 70, 48, 48, 52, 67, 48, 48, 54, 57, 48, 48, 54, 50, 48, 48, 55, 50, 48, 48, 54, 53, 48, 48, 52, 70, 48, 48, 54, 54, 48, 48, 54, 54, 48, 48, 54, 57, 48, 48, 54, 51, 48, 48, 54, 53, 48, 48, 50, 48, 48, 48, 51, 54, 48, 48, 50, 69, 48, 48, 51, 48, 62, 10, 47, 67, 114, 101, 97, 116, 105, 111, 110, 68, 97, 116, 101, 40, 68, 58, 50, 48, 49, 57, 48, 56, 50, 48, 49, 50, 53, 48, 52, 56, 43, 48, 50, 39, 48, 48, 39, 41, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 120, 114, 101, 102, 10, 48, 32, 57, 10, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 32, 54, 53, 53, 51, 53, 32, 102, 32, 10, 48, 48, 48, 48, 48, 48, 48, 50, 50, 48, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 48, 49, 57, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 49, 50, 54, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 51, 56, 56, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 49, 52, 53, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 49, 54, 55, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 52, 56, 54, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 53, 56, 50, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 116, 114, 97, 105, 108, 101, 114, 10, 60, 60, 47, 83, 105, 122, 101, 32, 57, 47, 82, 111, 111, 116, 32, 55, 32, 48, 32, 82, 10, 47, 73, 110, 102, 111, 32, 56, 32, 48, 32, 82, 10, 47, 73, 68, 32, 91, 32, 60, 57, 48, 53, 56, 57, 48, 65, 57, 67, 68, 69, 52, 56, 53, 55, 55, 68, 52, 48, 67, 57, 52, 68, 65, 51, 54, 52, 52, 55, 65, 54, 56, 62, 10, 60, 57, 48, 53, 56, 57, 48, 65, 57, 67, 68, 69, 52, 56, 53, 55, 55, 68, 52, 48, 67, 57, 52, 68, 65, 51, 54, 52, 52, 55, 65, 54, 56, 62, 32, 93, 10, 47, 68, 111, 99, 67, 104, 101, 99, 107, 115, 117, 109, 32, 47, 55, 69, 48, 67, 69, 66, 50, 50, 55, 69, 69, 68, 66, 56, 49, 66, 56, 69, 65, 51, 69, 68, 54, 70, 56, 68, 67, 54, 53, 53, 57, 55, 10, 62, 62, 10, 115, 116, 97, 114, 116, 120, 114, 101, 102, 10, 55, 53, 54, 10, 37, 37, 69, 79, 70, 10])
    });

    // Used to make setTimeout call the passed callback immediately
    // @ts-ignore
    global.setTimeout = fn => fn();
  });

  test('fax is sent', async () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedClient = {} as HttpClientModule;

    // @ts-ignore
    mockedClient.post = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { sessionId: '123123' } }),
      );
    mockedClient.get = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { faxStatusType: 'SENT' } }),
      );

    const faxModule = createFaxModule(mockedClient);

    const fax: Fax = {
      faxlineId: 'f0',
      filename: './path/to/valid.pdf',
      recipient: '+4912368712',
    };

    await expect(faxModule.send(fax)).resolves.not.toThrow();
  });

  test('fax is sent without given faxline id', async () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedClient = {} as HttpClientModule;

    // @ts-ignore
    mockedClient.post = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { sessionId: '123123' } }),
      );
    mockedClient.get = jest
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

    const faxModule = createFaxModule(mockedClient);

    const fax: Fax = {
      filename: './path/to/valid.pdf',
      recipient: '+4912368712',
    };

    await expect(faxModule.send(fax)).resolves.not.toThrow();
  });

  test('throws exception when fax status could not be fetched', async () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockClient = {} as HttpClientModule;

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
});
