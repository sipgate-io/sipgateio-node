import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
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

  test('It sends a SMS with error', async () => {
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
});
