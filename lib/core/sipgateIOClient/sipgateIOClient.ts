import { AuthCredentials } from './sipgateIOClient.types';
import { HttpClientModule, createHttpClient } from '../httpClient';

export const sipgateIO = (credentials: AuthCredentials): HttpClientModule => {
	return createHttpClient(credentials);
};
