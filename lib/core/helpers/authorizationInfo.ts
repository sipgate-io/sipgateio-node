import { SipgateIOClient } from '../sipgateIOClient';
import { UserInfo } from '../core.types';

export const getAuthenticatedWebuser = async (
	httpClient: SipgateIOClient
): Promise<string> => {
	const requestData = await httpClient.get<UserInfo>('authorization/userinfo');
	return requestData.sub;
};
