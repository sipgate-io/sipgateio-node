import { HttpClientModule } from '../sipgateIOClient';
import { UserInfo } from '../core.types';

export const getAuthenticatedWebuser = async (
	httpClient: HttpClientModule
): Promise<string> => {
	const requestData = await httpClient.get<UserInfo>('authorization/userinfo');
	return requestData.sub;
};
