import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import {
  Fax,
  FaxLine,
  FaxLineListObject,
  SendFaxSessionResponse,
  UserInfo,
} from '../core/models';
import { getUserInfo } from '../core/userHelper/userHelper';
import { validatePdfFileContent } from '../core/validator';
import { FaxModule } from './fax.module';

const POLLING_INTERVAL = 5000;

export const createFaxModule = (client: HttpClientModule): FaxModule => ({
  async send(
    recipient: string,
    fileContent: Buffer,
    filename: string,
    faxlineId?: string,
  ): Promise<void> {
    const fileContentValidationResult = validatePdfFileContent(fileContent);

    if (!fileContentValidationResult.valid) {
      throw fileContentValidationResult.cause;
    }

    if (!faxlineId) {
      const userInfo = await getUserInfo(client);
      faxlineId = await getFirstFaxLineId(client, userInfo);
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
  while (true) {
    await sleep(POLLING_INTERVAL);

    const { data } = await client.get(`/history/${sessionId}`);

    if (!data) {
      throw new Error('No data in fetchFaxStatus');
    }

    if (data.faxStatusType === 'SENT') {
      return;
    }

    if (data.faxStatusType === 'FAILED') {
      throw new Error('Fax could not be sent');
    }
  }
};

const sleep = async (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const handleError = (error: any) => {
  if (error instanceof Error) {
    return error;
  }

  if (error.response.status === 404) {
    return new Error('Could not fetch the fax status');
  }

  return handleCoreError(error);
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
