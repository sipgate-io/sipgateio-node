import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ErrorMessage } from '../core/errors/ErrorMessage';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import {
  ShortMessage,
  SmsCallerId,
  SmsExtension,
  UserInfo,
} from '../core/models';
import {
  containsPhoneNumber,
  createSMSModule,
  getSmsCallerIds,
  getUserSMSExtensions,
} from './sms';
import { SMSModule } from './sms.module';

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
      ErrorMessage.SMS_INVALID_EXTENSION,
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
      ErrorMessage.NETWORK_ERROR,
    );
  });
});

describe('schedule sms', () => {
  let smsModule: SMSModule;
  let mockClient: HttpClientModule;
  beforeAll(() => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    mockClient = {} as HttpClientModule;
    smsModule = createSMSModule(mockClient);
  });

  test('should use sentAt set', async () => {
    const message: ShortMessage = {
      message: 'ValidMessage',
      recipient: '015739777777',
      smsId: 'validExtensionId',
    };

    const date: Date = new Date(
      new Date().setSeconds(new Date().getSeconds() + 60),
    );

    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        data: {},
        status: 200,
      });
    });

    await smsModule.schedule(message, date);

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
            id: 0,
            phonenumber: '+4912345678',
            verified: true,
          },
          {
            defaultNumber: false,
            id: 1,
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

describe('Numbers Verification', () => {
  test('should verify phone number correctly', async () => {
    const smsCallerIds: SmsCallerId[] = [
      {
        defaultNumber: true,
        id: 0,
        phonenumber: '+4912345678',
        verified: true,
      },
      {
        defaultNumber: false,
        id: 1,
        phonenumber: '+4987654321',
        verified: false,
      },
    ];

    const verificationStatus = containsPhoneNumber(smsCallerIds, '+4912345678');

    expect(verificationStatus).toBeTruthy();
  });

  test('should not verify phone number', async () => {
    const smsCallerIds: SmsCallerId[] = [
      {
        defaultNumber: true,
        id: 0,
        phonenumber: '+4912345678',
        verified: true,
      },
      {
        defaultNumber: false,
        id: 1,
        phonenumber: '+4987654321',
        verified: false,
      },
    ];

    const verificationStatus = containsPhoneNumber(smsCallerIds, '+4987654321');

    expect(verificationStatus).toBeFalsy();
  });

  test('should not verify phone unknown number', async () => {
    const smsCallerIds: SmsCallerId[] = [
      {
        defaultNumber: true,
        id: 0,
        phonenumber: '+4912345678',
        verified: true,
      },
      {
        defaultNumber: false,
        id: 1,
        phonenumber: '+4987654321',
        verified: false,
      },
    ];

    const verificationStatus = containsPhoneNumber(smsCallerIds, '12345678');

    expect(verificationStatus).toBeFalsy();
  });
});
