import { AuthCredentials } from './sipgateIOClient.module';
import { HttpClientModule, createHttpClient } from '../httpClient';

export const sipgateIO = (credentials: AuthCredentials): HttpClientModule => {
	return createHttpClient(credentials);
};
