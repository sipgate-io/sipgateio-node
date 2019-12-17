import { HttpClientModule } from '../httpClient';

export interface AuthInfo {
	sub: string;
}

export const getAuthenticatedWebuser = (
	httpClient: HttpClientModule
): Promise<string> => {
	return httpClient
		.get<AuthInfo>('authorization/userinfo')
		.then(requestData => requestData.data.sub);
};
