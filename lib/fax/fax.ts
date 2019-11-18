import { ErrorMessage } from '../core/errors';
import {
	Fax,
	FaxDTO,
	FaxLine,
	FaxLineListObject,
	FaxStatusType,
	HistoryFaxResponse,
	SendFaxSessionResponse,
	UserInfo,
} from '../core/models';
import { FaxModule } from './fax.module';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { getUserInfo } from '../core/userHelper';
import { validatePdfFileContent } from '../core/validator';
import handleCoreError from '../core/errors/handleCoreError';

export const createFaxModule = (client: HttpClientModule): FaxModule => ({
	async send(faxObject: Fax): Promise<SendFaxSessionResponse> {
		const fax = faxObject;

		const fileContentValidationResult = validatePdfFileContent(fax.fileContent);

		if (!fileContentValidationResult.isValid) {
			throw new Error(fileContentValidationResult.cause);
		}

		if (!fax.faxlineId) {
			const userInfo = await getUserInfo(client);
			fax.faxlineId = await getFirstFaxLineId(client, userInfo);
		}

		if (!fax.filename) {
			fax.filename = generateFilename();
		}

		const faxDTO: FaxDTO = {
			base64Content: fax.fileContent.toString('base64'),
			faxlineId: fax.faxlineId,
			filename: fax.filename,
			recipient: fax.recipient,
		};

		return await client
			.post<SendFaxSessionResponse>('/sessions/fax', faxDTO)
			.then(response => response.data)
			.catch(error => Promise.reject(handleError(error)));
	},
	async getFaxStatus(sessionId: string): Promise<FaxStatusType> {
		return client
			.get<HistoryFaxResponse>(`/history/${sessionId}`)
			.then(({ data }) => {
				if (!data.type || data.type !== 'FAX') {
					throw new Error(ErrorMessage.FAX_NOT_A_FAX);
				}

				return data.faxStatusType;
			})
			.catch(error => Promise.reject(handleError(error)));
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

const getFirstFaxLineId = async (
	client: HttpClientModule,
	userInfo: UserInfo
): Promise<string> => {
	return getUserFaxLines(client, userInfo.sub).then(faxlines =>
		faxlines.length > 0
			? faxlines[0].id
			: Promise.reject(new Error(ErrorMessage.FAX_NO_FAXLINE))
	);
};

export const getUserFaxLines = async (
	client: HttpClientModule,
	sub: string
): Promise<FaxLine[]> => {
	return client
		.get<FaxLineListObject>(`${sub}/faxlines`)
		.then(response => response.data.items)
		.catch(error => Promise.reject(handleError(error)));
};

const handleError = (error: HttpError): Error => {
	if (!error.response) {
		return error;
	}

	if (error.response.status === 404) {
		return new Error(ErrorMessage.FAX_NOT_FOUND);
	}

	return handleCoreError(error);
};
