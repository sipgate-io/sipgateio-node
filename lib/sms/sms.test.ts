import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Message } from '../core/models';
import { createSMSModule } from './sms';

describe('SMS Module', () => {
  const instance = axios.create();
  const mock = new MockAdapter(instance);
  const smsModule = createSMSModule(instance);

  beforeEach(() => {
    mock.reset();
  });

  it('It sends a SMS successfully', async () => {
    mock.onPost('/sessions/sms').reply(200, '');

    const message: Message = {
      message: 'ValidMessage',
      recipient: 'validFonNumber',
      smsId: 'validExtensionId',
    };
    const result = await smsModule.send(message);
    expect(result).toEqual('');
  });

  it('It sends a SMS with error', async () => {
    mock.onPost('/sessions/sms').reply(403);

    const message: Message = {
      message: 'ValidMessage',
      recipient: 'validFonNumber',
      smsId: 'nonValidExtensionId',
    };

    await expect(smsModule.send(message)).rejects.toThrow(
      'Wrong SMS extension',
    );
  });
});
