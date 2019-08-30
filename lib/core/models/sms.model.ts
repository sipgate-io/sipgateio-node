export interface ShortMessage {
  smsId: string;
  recipient: string;
  message: string;
  sendAt?: number;
}

export interface SmsExtension {
  id: string;
  alias: string;
  callerId: string;
}

export interface SmsExtensions {
  items: SmsExtension[];
}

export interface SmsCallerId {
  id: number;
  phonenumber: string;
  verified: boolean;
  defaultNumber: boolean;
}

export interface SmsCallerIds {
  items: SmsCallerId[];
}
