import { ErrorMessage } from './errors/ErrorMessage';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { RTCMCall } from './rtcm.types';
import { createRTCMModule } from './rtcm';

describe('RTCM Module', () => {
	let mockClient: SipgateIOClient;

	beforeEach(() => {
		mockClient = {} as SipgateIOClient;
	});

	it('validates the DTMF sequence correctly and throws an error if invalid', async () => {
		const rtcmModule = createRTCMModule(mockClient);

		await expect(
			rtcmModule.sendDTMF({} as RTCMCall, ' A')
		).rejects.toThrowError(ErrorMessage.DTMF_INVALID_SEQUENCE);
	});

	it('uppercases the DTMF sequence and validates it correctly', async () => {
		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({
				response: {
					status: 204,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(
			rtcmModule.sendDTMF({} as RTCMCall, 'abc')
		).resolves.not.toThrow();
	});

	it('returns the correct error message if a call could not be found', async () => {
		mockClient.put = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(rtcmModule.mute({} as RTCMCall, false)).rejects.toThrowError(
			ErrorMessage.RTCM_CALL_NOT_FOUND
		);
	});

	it('returns the correct error message if a call could not be found', async () => {
		mockClient.put = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(
			rtcmModule.record({} as RTCMCall, { announcement: true, value: true })
		).rejects.toThrowError(ErrorMessage.RTCM_CALL_NOT_FOUND);
	});

	it('returns the correct error message if a call could not be found', async () => {
		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(
			rtcmModule.announce(
				{} as RTCMCall,
				'https://static.sipgate.com/examples/wav/example.wav'
			)
		).rejects.toThrowError(ErrorMessage.RTCM_CALL_NOT_FOUND);
	});
	it('returns the correct error message if a call could not be found', async () => {
		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(
			rtcmModule.transfer({} as RTCMCall, {
				attended: true,
				phoneNumber: '+49123456789test',
			})
		).rejects.toThrowError(ErrorMessage.RTCM_CALL_NOT_FOUND);
	});
	it('returns the correct error message if a call could not be found', async () => {
		mockClient.post = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(
			rtcmModule.sendDTMF({} as RTCMCall, 'abc')
		).rejects.toThrowError(ErrorMessage.RTCM_CALL_NOT_FOUND);
	});

	it('returns the correct error message if a call could not be found', async () => {
		mockClient.put = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(rtcmModule.hold({} as RTCMCall, false)).rejects.toThrowError(
			ErrorMessage.RTCM_CALL_NOT_FOUND
		);
	});

	it('returns the correct error message if a call could not be found', async () => {
		mockClient.delete = jest.fn().mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					status: 404,
				},
			});
		});

		const rtcmModule = createRTCMModule(mockClient);

		await expect(rtcmModule.hangUp({} as RTCMCall)).rejects.toThrowError(
			ErrorMessage.RTCM_CALL_NOT_FOUND
		);
	});
});
