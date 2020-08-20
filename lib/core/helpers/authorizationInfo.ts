import { SipgateIOClient } from '../sipgateIOClient';
import { UserInfo } from '../core.types';

export const getAuthenticatedWebuser = (
	httpClient: SipgateIOClient
): Promise<string> => {
	return httpClient
		.get<UserInfo>('authorization/userinfo')
		.then((response) => response.sub);
};
