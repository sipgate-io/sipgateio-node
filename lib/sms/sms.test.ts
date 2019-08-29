import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { ShortMessage, SmsExtension, UserInfo } from '../core/models';
import { createSMSModule, getSmsCallerIds, getUserSMSExtensions } from './sms';

describe('SMS Module', () => {
  const instance = axios.create();
  const mock = new MockAdapter(instance);
  const smsModule = createSMSModule(instance);

  beforeEach(() => {
    mock.reset();
  });

  test('It sends a SMS successfully', async () => {
    mock.onPost('/sessions/sms').reply(200, '');

    const message: ShortMessage = {
      message: 'ValidMessage',
      recipient: '015739777777',
      smsId: 'validExtensionId',
    };

    await expect(smsModule.send(message)).resolves.not.toThrow();
  });

  test('It sends an invalid SMS with error', async () => {
    mock.onPost('/sessions/sms').reply(403);

    const message: ShortMessage = {
      message: 'ValidMessage',
      recipient: '015739777777',
      smsId: 'nonValidExtensionId',
    };

    await expect(smsModule.send(message)).rejects.toThrow(
      'Invalid SMS extension',
    );
  });

  test('It sends SMS with unreachable server with error', async () => {
    mock.onPost('/sessions/sms').networkError();

    const message: ShortMessage = {
      message: 'ValidMessage',
      recipient: '015739777777',
      smsId: 'nonValidExtensionId',
    };

    await expect(smsModule.send(message)).rejects.toThrow(
      'getaddrinfo ENOTFOUND',
    );
  });
});

describe('schedule sms', () => {
  test('should use sentAt set', () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockClient = {} as HttpClientModule;

    const smsModule = createSMSModule(mockClient);
    const message: ShortMessage = {
      message: 'ValidMessage',
      recipient: '015739777777',
      smsId: 'validExtensionId',
    };

    const date: Date = new Date();

    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        data: {},
        status: 200,
      });
    });

    smsModule.schedule(message, date);

    expect(mockClient.post).toBeCalledWith('/sessions/sms', message);
  });
});

describe('SMS Extension List', () => {
  test('should get SMS ID LIST', async () => {
    const mockUserID = '0000000';
    const mockData = {
      data: {
        items: [
          {
            alias: "Alexander Bain's fax",
            callerId: '+94123456789',
            id: 'f0',
          },
        ],
      },
      status: 200,
    };

    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedClient = {} as HttpClientModule;

    mockedClient.get = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockData));

    await expect(
      getUserSMSExtensions(mockedClient, mockUserID),
    ).resolves.not.toThrow();

    const userFaxLines = await getUserSMSExtensions(mockedClient, mockUserID);
    expect(userFaxLines).toEqual(mockData.data.items);
  });
});

describe('CallerIds for SMS Extension', () => {
  test('should get callerIds for sms extension', async () => {
    const mockData = {
      data: {
        items: [
          {
            defaultNumber: true,
            id: 's0',
            phonenumber: '+4912345678',
            verified: true,
          },
          {
            defaultNumber: false,
            id: 's1',
            phonenumber: '+4987654321',
            verified: false,
          },
        ],
      },
    };

    const userInfo: UserInfo = {
      domain: '',
      locale: '',
      masterSipId: '',
      sub: '',
    };

    const smsExtension: SmsExtension = {
      alias: 'SMS Extension',
      callerId: '+4912345678',
      id: 's0',
    };

    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedClient = {} as HttpClientModule;

    mockedClient.get = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockData));

    const callerIds = await getSmsCallerIds(
      mockedClient,
      userInfo.sub,
      smsExtension.id,
    );
    expect(callerIds).toEqual(mockData.data.items);
  });
});
