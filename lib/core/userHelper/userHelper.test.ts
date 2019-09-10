import { HttpClientModule } from '../httpClient';
import { getUserInfo } from './userHelper';

let mockClient: HttpClientModule;

describe('UserHelper Test', () => {
  beforeAll(() => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    mockClient = {} as HttpClientModule;
  });

  test('should throw exception when user is not authorized', async () => {
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
