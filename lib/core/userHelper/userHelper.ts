import { HttpClientModule } from '../httpClient';
import { UserInfo } from '../models';
import handleCoreError from '../errors/handleCoreError';

export const getUserInfo = async (
	client: HttpClientModule
): Promise<UserInfo> => {
	return await client
		.get<UserInfo>('/authorization/userinfo')
		.then(res => res.data)
		.catch(error => Promise.reject(handleCoreError(error)));
};
