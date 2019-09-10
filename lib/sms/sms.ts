import { ConnectionError, ErrorMessage, ExtensionError } from '../core/errors';
import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule } from '../core/httpClient';
import {
  ShortMessage,
  SmsCallerId,
  SmsCallerIds,
  SmsExtension,
  SmsExtensions,
} from '../core/models';
import { validatePhoneNumber } from '../core/validator';
import { SMSModule } from './sms.module';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
  async send(sms: ShortMessage): Promise<void> {
    const phoneNumberValidationResult = validatePhoneNumber(sms.recipient);

    if (!phoneNumberValidationResult.valid) {
      throw phoneNumberValidationResult.cause;
    }

    await client
      .post('/sessions/sms', sms)
      .catch(error => Promise.reject(handleError(error)));
  },
  async schedule(sms: ShortMessage, sendAt: Date): Promise<void> {
    if (
      sendAt > new Date() &&
      sendAt.getTime() < new Date().setMonth(new Date().getMonth() + 3)
    ) {
      sms.sendAt = sendAt.getTime() / 1000;
      return this.send(sms);
    }

    return Promise.reject(new Error(ErrorMessage.SMS_TIME_MUST_BE_IN_FUTURE));
  },
});

export const getUserSMSExtensions = async (
  client: HttpClientModule,
  sub: string,
): Promise<SmsExtension[]> => {
  return client
    .get<SmsExtensions>(`${sub}/sms`)
    .then(value => value.data.items)
    .catch(error => Promise.reject(handleError(error)));
};

export const getSmsCallerIds = async (
  client: HttpClientModule,
  webuserExtension: string,
  smsExtension: string,
): Promise<SmsCallerId[]> => {
  return client
    .get<SmsCallerIds>(`${webuserExtension}/sms/${smsExtension}/callerids`)
    .then(value => value.data.items)
    .catch(error => Promise.reject(handleError(error)));
};

export const containsPhoneNumber = (
  smsCallerIds: SmsCallerId[],
  phoneNumber: string,
): boolean => {
  const foundCallerId = smsCallerIds.find(
    smsCallerId => smsCallerId.phonenumber === phoneNumber,
  );

  return foundCallerId ? foundCallerId.verified : false;
};

const handleError = (e: any) => {
  if (
    e.message === 'Network Error' ||
    e.message.includes(ErrorMessage.NETWORK_ERROR)
  ) {
    return new ConnectionError();
  }
  if (e.response.status === 403) {
    return new ExtensionError(ErrorMessage.SMS_INVALID_EXTENSION);
  }

  return handleCoreError(e.message);
};
