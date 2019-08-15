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
