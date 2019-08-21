import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { FaxLine, FaxLineListObject, UserInfo } from '../core/models';

export const getUserInfo = async (
  client: HttpClientModule,
): Promise<UserInfo> => {
  try {
    const { data } = await client.get<UserInfo>('/authorization/userinfo');
    return data;
  } catch (e) {
    const newError = handleError(e);
    return Promise.reject(newError);
  }
};

const handleError = (e: any) => {
  return handleCoreError(e);
};

export const getUserFaxlines = async (
  client: HttpClientModule,
  masterSipId: string,
): Promise<FaxLine[]> => {
  try {
    const { data } = await client.get<FaxLineListObject>(
      `${masterSipId}/faxlines`,
    );

    return data.items;
  } catch (e) {
    const newError = handleError(e);
    return Promise.reject(newError);
  }
};
