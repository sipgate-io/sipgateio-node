import {
	GatherObject,
	GatherOptions,
	HangupObject,
	PlayObject,
	PlayOptions,
	RedirectObject,
	RedirectOptions,
	RejectObject,
	RejectOptions,
	VoicemailObject,
} from './models/webhookResponse.model';
import { WebhookResponse as WebhookResponseType } from './webhookResponse.module';

export const WebhookResponse: WebhookResponseType = {
	gatherDTMF: (gatherOptions: GatherOptions): GatherObject => {
		const gatherObject: GatherObject = {
			Gather: {
				_attributes: {
					maxDigits: String(gatherOptions.maxDigits),
					timeout: String(gatherOptions.timeout),
				},
			},
		};
		if (gatherOptions.announcement) {
			gatherObject.Gather['Play'] = {
				Url: gatherOptions.announcement,
			};
		}
		return gatherObject;
	},
	hangupCall: (): HangupObject => {
		return { Hangup: {} };
	},
	playAudio: (playOptions: PlayOptions): PlayObject => {
		return { Play: { Url: playOptions.announcement } };
	},
	redirectCall: (redirectOptions: RedirectOptions): RedirectObject => {
		return {
			Dial: {
				_attributes: {
					callerId: redirectOptions.callerId,
					anonymous: String(redirectOptions.anonymous),
				},
				Number: redirectOptions.numbers,
			},
		};
	},
	rejectCall: (rejectOptions?: RejectOptions): RejectObject => {
		return { Reject: { _attributes: { reason: rejectOptions?.reason } } };
	},
	sendToVoicemail: (): VoicemailObject => {
		return { Dial: { Voicemail: {} } };
	},
};
