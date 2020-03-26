import { ErrorMessage } from './errors/ErrorMessage';
import {
	Fax,
	FaxDTO,
	FaxStatus,
	HistoryFaxResponse,
	SendFaxSessionResponse,
} from './models/fax.model';
import { FaxModule } from './fax.module';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { handleCoreError } from '../core/errors/handleError';
import { validatePdfFileContent } from './validators/validatePdfFileContent';

export const createFaxModule = (client: HttpClientModule): FaxModule => ({
	async send(faxObject: Fax): Promise<SendFaxSessionResponse> {
		const fax = faxObject;
		const fileContentValidationResult = await validatePdfFileContent(
			fax.fileContent
		);

		if (!fileContentValidationResult.isValid) {
			throw new Error(fileContentValidationResult.cause);
		}

		if (!fax.filename) {
			fax.filename = generateFilename();
		}

		const faxDTO: FaxDTO = {
			base64Content: fax.fileContent.toString('base64'),
			faxlineId: fax.faxlineId,
			filename: fax.filename,
			recipient: 'to' in fax ? fax.to : fax.recipient,
		};

		return await client
			.post<SendFaxSessionResponse>('/sessions/fax', faxDTO)
			.then((response) => response.data)
			.catch((error) => Promise.reject(handleError(error)));
	},
	async getFaxStatus(sessionId: string): Promise<FaxStatus> {
		return client
			.get<HistoryFaxResponse>(`/history/${sessionId}`)
			.then(({ data }) => {
				if (!data.type || data.type !== 'FAX') {
					throw new Error(ErrorMessage.FAX_NOT_A_FAX);
				}

				return data.faxStatusType;
			})
			.catch((error) => Promise.reject(handleError(error)));
	},
});

const generateFilename = (): string => {
	const timestamp = new Date()
		.toJSON()
		.replace(/T/g, '_')
		.replace(/[.:-]/g, '')
		.slice(0, -6);
	return `Fax_${timestamp}`;
};

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 404) {
		return new Error(ErrorMessage.FAX_NOT_FOUND);
	}

	return handleCoreError(error);
};
