export interface UserInfo {
  sub: string;
  domain: string;
  masterSipId: string;
  locale: string;
}

export interface Fax {
  faxlineId: string;
  recipient: string;
  filename: string;
  base64Content: string;
}
