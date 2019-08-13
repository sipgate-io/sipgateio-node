export interface Message {
  smsId: string;
  recipient: string;
  message: string;
  sendAt?: number;
}
