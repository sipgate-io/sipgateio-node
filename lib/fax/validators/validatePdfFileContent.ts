import { ValidationResult } from '../../core/validator';

export enum FaxValidationMessage {
	INVALID_PDF_MIME_TYPE = 'Invalid PDF file',
}

const validatePdfFileContent = (content: Buffer): ValidationResult => {
	// see https://github.com/MaraniMatias/isPDF/blob/946ffba1ccbca4d7b88bda39e2dda426bd5b0977/index.js#L5
	const isPdf =
		content.lastIndexOf('%PDF-') === 0 &&
		content.lastIndexOf('%%EOF') > -1;

	if (!isPdf) {
		return {
			cause: FaxValidationMessage.INVALID_PDF_MIME_TYPE,
			isValid: false,
		};
	}

	return { isValid: true };
};
export { validatePdfFileContent };
