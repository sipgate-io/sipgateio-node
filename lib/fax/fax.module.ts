export interface FaxModule {
  send: (
    recipient: string,
    fileContent: Buffer,
    filename?: string,
    faxlineId?: string,
  ) => Promise<void>;
}
