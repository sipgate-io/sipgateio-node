export interface FaxModule {
  send: (
    recipient: string,
    fileContent: Buffer,
    faxlineId?: string,
  ) => Promise<void>;
}
