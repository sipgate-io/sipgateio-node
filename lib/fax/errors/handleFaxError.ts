import { HttpError, handleCoreError } from '../../core';

export enum FaxErrorMessage {
	FAX_NOT_FOUND = 'Fax was not found',
	NOT_A_FAX = 'History item is not a fax',
}

export const handleFaxError = (error: HttpError): Error => {
	if (error.response && error.response.status === 404) {
		return new Error(FaxErrorMessage.FAX_NOT_FOUND);
	}

	return handleCoreError(error);
};
