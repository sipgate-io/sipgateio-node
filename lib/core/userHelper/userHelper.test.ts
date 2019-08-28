import { HttpClientModule } from '../httpClient/httpClient.module';
import { getUserInfo } from './userHelper';

describe('UserHelper Test', () => {
  test('should throw exception when user is not authorized', async () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockClient = {} as HttpClientModule;

    mockClient.get = jest.fn().mockImplementationOnce(() => {
      return Promise.reject({
        response: {
          status: 401,
        },
      });
    });

    await expect(getUserInfo(mockClient)).rejects.toThrow();
  });

  test('should get webuser ID', async () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockClient = {} as HttpClientModule;

    mockClient.get = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        data: null,
      });
    });

    expect(async () => {
      await getUserInfo(mockClient);
    }).not.toThrow();
  });
});
