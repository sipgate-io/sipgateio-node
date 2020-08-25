import {
	FaxValidationMessage,
	validatePdfFileContent,
} from './validatePdfFileContent';
import validPDFBuffer from '../testfiles/validPDFBuffer';

describe('PDF file validation', () => {
	test('should return valid ValidationResult if pdf file content is valid', async () => {
		const validPdfFileContents = validPDFBuffer;

		await expect(validatePdfFileContent(validPdfFileContents)).resolves.toEqual(
			{
				isValid: true,
			}
		);
	});

	test('should return invalid ValidationResult if file content is invalid', async () => {
		const invalidPdfFileContents = Buffer.from('12ABC34');

		await expect(
			validatePdfFileContent(invalidPdfFileContents)
		).resolves.toEqual({
			cause: FaxValidationMessage.INVALID_PDF_MIME_TYPE,
			isValid: false,
		});
	});
});
