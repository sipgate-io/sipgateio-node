import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { Fax } from '../core/models';
import validPDFBuffer from '../core/validator/validPDFBuffer';
import { createFaxModule, getUserFaxLines } from './fax';

describe('Faxline ID List', () => {
  let mockClient: HttpClientModule;

  beforeAll(() => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    mockClient = {} as HttpClientModule;
  });

  test('should get faxline ID LIST', async () => {
    const mockUserID = '0000000';
    const mockData = {
      data: {
        items: [
          {
            alias: "Alexander Bain's fax",
            canReceive: false,
            canSend: false,
            id: 'f0',
            tagline: 'Example Ltd.',
          },
        ],
      },
    };

    mockClient.get = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockData));

    expect(async () => {
      await getUserFaxLines(mockClient, mockUserID);
    }).not.toThrow();

    const userFaxLines = await getUserFaxLines(mockClient, mockUserID);
    expect(userFaxLines).toEqual(mockData.data.items);
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

    await expect(getUserFaxLines(mockClient, mockUserID)).rejects.toThrow();
    await expect(getUserFaxLines(mockClient, mockUserID)).rejects.toThrow();
  });
});

describe('SendFax', () => {
  let mockClient: HttpClientModule;

  beforeAll(() => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    mockClient = {} as HttpClientModule;

    // Used to make setTimeout call the passed callback immediately
    // @ts-ignore
    global.setTimeout = fn => fn();
  });

  test('fax is sent', async () => {
    const faxModule = createFaxModule(mockClient);

    mockClient.post = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { sessionId: '123123' } }),
      );
    mockClient.get = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { type: 'FAX', faxStatusType: 'SENT' } }),
      );

    const recipient = '+4912368712';
    const fileContents = validPDFBuffer;
    const faxlineId = 'f0';

    await expect(
      faxModule.send(recipient, fileContents, 'testPdfFileName', faxlineId),
    ).resolves.not.toThrow();
  });

  test('fax is sent without given faxline id', async () => {
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
        Promise.resolve({ data: { type: 'FAX', faxStatusType: 'SENT' } }),
      );

    const faxModule = createFaxModule(mockClient);

    const recipient = '+4912368712';
    const fileContents = validPDFBuffer;

    await expect(
      faxModule.send(recipient, fileContents, 'testPdfFileName'),
    ).resolves.not.toThrow();
  });

  test('fax is sent without given filename', async () => {
    mockClient.post = jest
      .fn()
      .mockImplementationOnce((_, { filename }: Fax) => {
        expect(filename && /^Fax_2\d{7}_\d{4}$/.test(filename)).toBeTruthy();
        return Promise.resolve({ data: { sessionId: 123456 } });
      });

    mockClient.get = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { type: 'FAX', faxStatusType: 'SENT' } }),
      );

    const faxModule = createFaxModule(mockClient);

    const recipient = '+4912368712';
    const fileContents = validPDFBuffer;
    const faxlineId = 'f0';

    await faxModule.send(recipient, fileContents, undefined, faxlineId);
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

    const recipient = '+4912368712';
    const fileContents = validPDFBuffer;
    const faxlineId = 'f0';

    await expect(
      faxModule.send(recipient, fileContents, 'testPdfFileName', faxlineId),
    ).rejects.toThrowError(ErrorMessage.FAX_NOT_FOUND);
  });

  test('throws exception when fax status is failed', async () => {
    const faxModule = createFaxModule(mockClient);

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
        Promise.resolve({ data: { type: 'FAX', faxStatusType: 'FAILED' } }),
      );

    const recipient = '+4912368712';
    const fileContents = validPDFBuffer;
    const faxlineId = 'f0';

    await expect(
      faxModule.send(recipient, fileContents, 'testPdfFileName', faxlineId),
    ).rejects.toThrowError(ErrorMessage.FAX_COULD_NOT_BE_SENT);
  });

  test('throws exception when timeout is exceeded', async () => {
    const faxModule = createFaxModule(mockClient);

    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          sessionId: 123123,
        },
        status: 200,
      });
    });

    mockClient.get = jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: { type: 'FAX', faxStatusType: 'PENDING' },
      }),
    );

    const recipient = '+4912368712';
    const fileContents = validPDFBuffer;
    const faxlineId = 'f0';

    await expect(
      faxModule.send(recipient, fileContents, 'testPdfFileName', faxlineId),
    ).rejects.toThrowError(ErrorMessage.FAX_FETCH_STATUS_TIMED_OUT);
  });
});
