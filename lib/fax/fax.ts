import { ErrorMessage } from '../core/errors';
import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule, HttpError } from '../core/httpClient';
import {
  Fax,
  FaxLine,
  FaxLineListObject,
  SendFaxSessionResponse,
  UserInfo,
} from '../core/models';
import { getUserInfo } from '../core/userHelper';
import { validatePdfFileContent } from '../core/validator';
import { FaxModule } from './fax.module';

const POLLING_INTERVAL = 5000;
const POLLING_TIMEOUT = 30 * 60 * 1000;

export const createFaxModule = (client: HttpClientModule): FaxModule => ({
  async send(
    recipient: string,
    fileContent: Buffer,
    filename?: string,
    faxlineId?: string,
  ): Promise<void> {
    const fileContentValidationResult = validatePdfFileContent(fileContent);

    if (!fileContentValidationResult.isValid) {
      throw fileContentValidationResult.cause;
    }

    if (!faxlineId) {
      const userInfo = await getUserInfo(client);
      faxlineId = await getFirstFaxLineId(client, userInfo);
    }

    if (!filename) {
      const timestamp = new Date()
        .toJSON()
        .replace(/T/g, '_')
        .replace(/[.:-]/g, '')
        .slice(0, -5);
      filename = `Fax_${timestamp}`;
    }

    const fax: Fax = {
      base64Content: fileContent.toString('base64'),
      faxlineId,
      filename,
      recipient,
    };

    const sendFaxSessionResponse = await client
      .post<SendFaxSessionResponse>('/sessions/fax', fax)
      .catch(error => Promise.reject(handleError(error)));

    await fetchFaxStatus(client, sendFaxSessionResponse.data.sessionId).catch(
      error => Promise.reject(handleError(error)),
    );
  },
});

const getFirstFaxLineId = async (
  client: HttpClientModule,
  userInfo: UserInfo,
): Promise<string> => {
  const { sub } = userInfo;
  const faxlines = await getUserFaxLines(client, sub);
  const { id } = faxlines[0];
  return id;
};

const fetchFaxStatus = async (
  client: HttpClientModule,
  sessionId: string,
): Promise<any> => {
  let untilTimeout = POLLING_TIMEOUT;
  while (untilTimeout > 0) {
    await sleep(POLLING_INTERVAL);
    untilTimeout -= POLLING_INTERVAL;

    const { data } = await client.get(`/history/${sessionId}`);

    if (!data) {
      throw new Error(ErrorMessage.FAX_NO_DATA_IN_FETCH_STATUS);
    }

    if (!data.type || data.type !== 'FAX') {
      throw new Error(ErrorMessage.FAX_NOT_A_FAX);
    }

    if (data.faxStatusType === 'SENT') {
      return;
    }

    if (data.faxStatusType === 'FAILED') {
      throw new Error(ErrorMessage.FAX_COULD_NOT_BE_SENT);
    }
  }
  throw new Error(ErrorMessage.FAX_FETCH_STATUS_TIMED_OUT);
};

export const getUserFaxLines = async (
  client: HttpClientModule,
  sub: string,
): Promise<FaxLine[]> => {
  return client
    .get<FaxLineListObject>(`${sub}/faxlines`)
    .then(response => response.data.items)
    .catch(error => Promise.reject(handleError(error)));
};

const sleep = async (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

const handleError = (error: HttpError): Error => {
  if (!error.response) {
    return error;
  }

  if (error.response.status === 404) {
    return new Error(ErrorMessage.FAX_NOT_FOUND);
  }

  return handleCoreError(error);
};
