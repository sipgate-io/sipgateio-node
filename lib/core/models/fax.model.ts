export interface UserInfo {
  sub: string;
  domain: string;
  masterSipId: string;
  locale: string;
}

export interface SendFaxSessionResponse {
  sessionId: string;
}

export interface FaxDTO {
  faxlineId?: string;
  recipient: string;
  filename?: string;
  base64Content: string;
}

export interface Fax {
  recipient: string;
  fileContent: Buffer;
  filename?: string;
  faxlineId?: string;
}

export interface FaxLine {
  id: string;
  alias: string;
  tagline: string;
  canSend: boolean;
  canReceive: boolean;
}

export interface FaxLineListObject {
  items: FaxLine[];
}

export interface HistoryFaxResponse {
  type: 'FAX';
  faxStatusType: FaxStatusType;
}

export enum FaxStatusType {
  SENT = 'SENT',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SENDING = 'SENDING',
  SCHEDULED = 'SCHEDULED',
}
