export interface UserInfo {
  sub: string;
  domain: string;
  masterSipId: string;
  locale: string;
}

export interface SendFaxSessionResponse {
  sessionId: string;
}

export interface Fax {
  faxlineId?: string;
  recipient: string;
  filename: string;
  base64Content: string;
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
