import { HttpError, handleCoreError } from '../../core';

export enum NumbersErrorMessage {
	BAD_REQUEST = 'Invalid pagination input',
}

export const handleNumbersError = (error: HttpError<unknown>): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(NumbersErrorMessage.BAD_REQUEST);
	}

	return handleCoreError(error);
};
