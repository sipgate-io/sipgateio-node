import { ErrorMessage } from './ErrorMessage';
import { HttpError } from '../sipgateIOClient';

export const handleCoreError = (error: HttpError<unknown>): Error => {
	if (error.response && error.response.status === 401) {
		return new Error(ErrorMessage.HTTP_401);
	}

	if (error.response && error.response.status === 403) {
		return new Error(ErrorMessage.HTTP_403);
	}

	return new Error(error.message);
};
