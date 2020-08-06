import { ValidationResult } from '../../core/validator';
import fileType from 'file-type';

export enum FaxValidationMessage {
	INVALID_PDF_MIME_TYPE = 'Invalid PDF file',
}

const validatePdfFileContent = async (
	content: Buffer
): Promise<ValidationResult> => {
	const fileTypeResult = await fileType.fromBuffer(content);

	if (!fileTypeResult || fileTypeResult.mime !== 'application/pdf') {
		return {
			cause: FaxValidationMessage.INVALID_PDF_MIME_TYPE,
			isValid: false,
		};
	}

	return { isValid: true };
};
export { validatePdfFileContent };
