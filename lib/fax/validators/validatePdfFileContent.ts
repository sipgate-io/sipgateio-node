import { ValidationResult } from '../../core/validator';

export enum FaxValidationMessage {
	INVALID_PDF_MIME_TYPE = 'Invalid PDF file',
}

// taken from https://github.com/MaraniMatias/isPDF
const isValidPDF = (buffer: Buffer): boolean => {
	return buffer.lastIndexOf('%PDF-') === 0 && buffer.lastIndexOf('%%EOF') > -1;
};

const validatePdfFileContent = (content: Buffer): ValidationResult => {
	const isPdf = isValidPDF(content);
	if (!isPdf) {
		return {
			cause: FaxValidationMessage.INVALID_PDF_MIME_TYPE,
			isValid: false,
		};
	}

	return { isValid: true };
};
export { validatePdfFileContent };
