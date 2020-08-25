import { HttpError, handleCoreError } from '../../core';

export enum HistoryErrorMessage {
	BAD_REQUEST = 'Invalid filter or pagination input',
	EVENT_NOT_FOUND = 'The requested history event could not be found',
}

export const handleHistoryError = (error: HttpError<unknown>): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(HistoryErrorMessage.BAD_REQUEST);
	}

	if (error.response && error.response.status === 404) {
		return new Error(HistoryErrorMessage.EVENT_NOT_FOUND);
	}

	return handleCoreError(error);
};
