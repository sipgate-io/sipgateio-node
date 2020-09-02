import {
	FaxValidationMessage,
	validatePdfFileContent,
} from './validatePdfFileContent';
import validPDFBuffer from '../testfiles/validPDFBuffer';

import { Buffer } from 'buffer';

describe('PDF file validation', () => {
	test('should return valid ValidationResult if pdf file content is valid', async () => {
		const validPdfFileContents = validPDFBuffer;

		expect(validatePdfFileContent(validPdfFileContents)).toEqual({
			isValid: true,
		});
	});

	test('should return invalid ValidationResult if file content is invalid', async () => {
		const invalidPdfFileContents = Buffer.from('12ABC34');

		expect(validatePdfFileContent(invalidPdfFileContents)).toEqual({
			cause: FaxValidationMessage.INVALID_PDF_MIME_TYPE,
			isValid: false,
		});
	});
});
