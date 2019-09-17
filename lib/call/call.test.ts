import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { createCallModule } from './call';
import { CallModule } from './call.module';

describe('Call Module', () => {
  let callModule: CallModule;
  let mockClient: HttpClientModule;

  beforeAll(() => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    mockClient = {} as HttpClientModule;
    callModule = createCallModule(mockClient);
  });

  it('should init a call successfully', async () => {
    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          sessionId: '1234564545454545',
        },
        status: 200,
      });
    });
    const validExtensionId = 'e0';
    const validCalleeNumber = '0123456789123';
    const validCallerId = '0123456789';

    await expect(
      callModule.initCall(validExtensionId, validCalleeNumber, validCallerId),
    ).resolves.not.toThrow();
  });

  it('should throw an exception for invalid extensionID', async () => {
    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.reject({
        response: {
          status: 403,
        },
      });
    });

    const inValidExtensionId = 'e-18';
    const validCalleeNumber = '0123456789123';
    const validCallerId = '0123456789';

    await expect(
      callModule.initCall(inValidExtensionId, validCalleeNumber, validCallerId),
    ).rejects.toThrow(ErrorMessage.CALL_INVALID_EXTENSION);
  });

  it('should throw an exception for insufficient funds', async () => {
    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.reject({
        response: {
          status: 402,
        },
      });
    });

    const inValidExtensionId = 'e-18';
    const validCalleeNumber = '0123456789123';
    const validCallerId = '0123456789';

    await expect(
      callModule.initCall(inValidExtensionId, validCalleeNumber, validCallerId),
    ).rejects.toThrow(ErrorMessage.CALL_INSUFFICIENT_FUNDS);
  });

  it('should throw an exception for bad request', async () => {
    mockClient.post = jest.fn().mockImplementationOnce(() => {
      return Promise.reject({
        response: {
          status: 400,
        },
      });
    });

    const validExtensionId = 'e0';
    const validCalleeNumber = 'test';
    const inValidCallerId = '0123456789';

    await expect(
      callModule.initCall(validExtensionId, validCalleeNumber, inValidCallerId),
    ).rejects.toThrow(ErrorMessage.BAD_REQUEST);
  });
});
