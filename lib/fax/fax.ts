import * as fs from 'fs';
import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { Fax, FaxLine, FaxLineListObject, UserInfo } from '../core/models';
import { validatePdfFile } from '../core/validator';
import { FaxModule } from './fax.module';

let timeout = 40000;
const timespan = 5000;

export const createFaxModule = (client: HttpClientModule): FaxModule => ({
  async send(fax: Fax): Promise<boolean> {
    const { filename: filepath, faxlineId } = fax;
    fax.base64Content = readFileAsBase64(filepath);

    if (!faxlineId) {
      fax.faxlineId = await getFaxLineId(client);
    }

    const {
      data: { sessionId },
    } = await client.post('/sessions/fax', fax);
    while (timeout > 0) {
      timeout = timeout - timespan;
      await sleep(timespan);

      try {
        const { data } = await fetchFaxStatus(client, sessionId);

        if (data) {
          if (data.faxStatusType === 'SENT') {
            return true;
          }
        }
      } catch (e) {
        return Promise.reject(new Error('Could not fetch the fax status'));
      }
    }

    return Promise.reject(new Error('Timeout error'));
  },
});

const getFaxLineId = async (client: HttpClientModule): Promise<string> => {
  const userInfo = await getUserInfo(client);
  const { sub } = userInfo;
  const faxlines: FaxLine[] = await getUserFaxLines(client, sub);
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
    const { data } = await client.get(`/history/${sessionId}`);

    return data;
  } catch (e) {
    const newError = handleError(e);
    return Promise.reject(newError);
  }
};

export const getUserInfo = async (
  client: HttpClientModule,
): Promise<UserInfo> => {
  try {
    const { data } = await client.get<UserInfo>('/authorization/userinfo');
    return data;
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
