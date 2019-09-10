import handleCoreError from '../errors/handleCoreError';
import { HttpClientModule } from '../httpClient';
import { UserInfo } from '../models';

export const getUserInfo = async (
  client: HttpClientModule,
): Promise<UserInfo> => {
  try {
    const { data } = await client.get<UserInfo>('/authorization/userinfo');
    return data;
  } catch (e) {
    const newError = handleCoreError(e);
    return Promise.reject(newError);
  }
};
