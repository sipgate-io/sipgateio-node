import { HttpClientModule } from '../httpClient';

export interface AuthInfo {
	sub: string;
}

export const getAuthenticatedWebuser = async (
	httpClient: HttpClientModule
): Promise<string> => {
	const requestData = await httpClient.get<AuthInfo>('authorization/userinfo');
	return requestData.data.sub;
};
