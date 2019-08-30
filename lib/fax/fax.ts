import fs from 'fs';
import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { Fax, FaxLine, FaxLineListObject, UserInfo } from '../core/models';
import { getUserInfo } from '../core/userHelper/userHelper';
import { validatePdfFile } from '../core/validator';
import { FaxModule } from './fax.module';

const POLLING_INTERVAL = 5000;

export const createFaxModule = (client: HttpClientModule): FaxModule => ({
  async send(fax: Fax): Promise<void> {
    const { filename: filepath, faxlineId } = fax;
    fax.base64Content = readFileAsBase64(filepath);

    if (!faxlineId) {
      const userInfo = await getUserInfo(client);
      fax.faxlineId = await getFirstFaxLineId(client, userInfo);
    }

    let sessionId;
    try {
      const { data } = await client.post('/sessions/fax', fax);
      sessionId = data.sessionId;
    } catch (e) {
      return Promise.reject(new Error('Could not be sent'));
    }

    try {
      await fetchFaxStatus(client, sessionId);
    } catch (e) {
      return Promise.reject(new Error('Could not fetch the fax status'));
    }
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

const readFileAsBase64 = (filePath: string) => {
  validatePdfFile(filePath);
  const fileContents = fs.readFileSync(filePath);
  return Buffer.from(fileContents).toString('base64');
};

const fetchFaxStatus = async (
  client: HttpClientModule,
  sessionId: string,
): Promise<any> => {
  try {
    while (true) {
      await sleep(POLLING_INTERVAL);
      const { data } = await client.get(`/history/${sessionId}`);

      if (data) {
        if (data.faxStatusType === 'SENT') {
          return Promise.resolve();
        }
        if (data.faxStatusType === 'FAILED') {
          return Promise.reject(new Error('Fax could not be sent'));
        }
      }
    }
  } catch (e) {
    const newError = handleError(e);
    return Promise.reject(newError);
  }
};

const sleep = async (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const handleError = (e: any) => {
  return handleCoreError(e);
};

export const getUserFaxLines = async (
  client: HttpClientModule,
  sub: string,
): Promise<FaxLine[]> => {
  try {
    const { data } = await client.get<FaxLineListObject>(`${sub}/faxlines`);

    return data.items;
  } catch (e) {
    const newError = handleError(e);
    return Promise.reject(newError);
  }
};
