import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { ShortMessage } from '../core/models';
import { createSMSModule } from './sms';

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
