// import { CallModule, createCallModule } from '../call';
import { HttpClientModule } from '../core/httpClient';
// import { ClickToDial } from '../core/models/call.model';

describe('Settings Module', () => {
  let settingsModule: SettingsModule;
  let mockClient: HttpClientModule;

  beforeEach(() => {
    mockClient = {} as HttpClientModule;
    settingsModule = createSettingsModule(mockClient);
  });

  it('should exist on client object', () =>{
  })

  it('should contain getSettings method', () => {
    expect(settingsModule.getSettings() instanceof Function);
  });

  //
  // it('should fetch settings from pushAPI', async () => {
  //   const expectedSessionId = '123456';
  //   mockClient.post = jest.fn().mockImplementation(() => {
  //     return Promise.resolve({
  //       data: {
  //         sessionId: expectedSessionId
  //       },
  //       status: 200
  //     });
  //   });
  //   const validExtension = 'e0';
  //   const validCalleeNumber = '+49123456789123';
  //   const validCallerId = '+49123456789';
  //
  //   const clickToDial: ClickToDial = {
  //     callee: validCalleeNumber,
  //     caller: validExtension,
  //     callerId: validCallerId
  //   };
  //
  //   await expect(callModule.initiate(clickToDial)).resolves.not.toThrow();
  //
  //   const { sessionId } = await callModule.initiate(clickToDial);
  //   expect(sessionId).toEqual(expectedSessionId);
  });