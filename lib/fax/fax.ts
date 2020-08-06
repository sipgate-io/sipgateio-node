import {
	Fax,
	FaxDTO,
	FaxModule,
	FaxStatus,
	HistoryFaxResponse,
	SendFaxSessionResponse,
} from './fax.types';
import { FaxErrorMessage, handleFaxError } from './errors/handleFaxError';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { validatePdfFileContent } from './validators/validatePdfFileContent';

export const createFaxModule = (client: SipgateIOClient): FaxModule => ({
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
			recipient: fax.to,
		};

		return await client
			.post<SendFaxSessionResponse>('/sessions/fax', faxDTO)
			.catch((error) => Promise.reject(handleFaxError(error)));
	},
	async getFaxStatus(sessionId: string): Promise<FaxStatus> {
		return client
			.get<HistoryFaxResponse>(`/history/${sessionId}`)
			.then((data) => {
				if (!data.type || data.type !== 'FAX') {
					throw new Error(FaxErrorMessage.NOT_A_FAX);
				}

				return data.faxStatusType;
			})
			.catch((error) => Promise.reject(handleFaxError(error)));
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
