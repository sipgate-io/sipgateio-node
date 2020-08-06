import { HttpClientModule } from '../httpClient';
import { UserInfo } from '../core.types';

export const getAuthenticatedWebuser = async (
	httpClient: HttpClientModule
): Promise<string> => {
	const requestData = await httpClient.get<UserInfo>('authorization/userinfo');
	return requestData.data.sub;
};
