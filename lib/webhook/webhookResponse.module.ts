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

export interface WebhookResponse {
	redirectCall: (redirectOptions: RedirectOptions) => RedirectObject;
	gatherDTMF: (gatherOptions: GatherOptions) => GatherObject;
	playAudio: (playOptions: PlayOptions) => PlayObject;
	rejectCall: (rejectOptions?: RejectOptions) => RejectObject;
	hangupCall: () => HangupObject;
	sendToVoicemail: () => VoicemailObject;
}

export enum RejectReason {
	BUSY = 'busy',
	REJECTED = 'rejected',
}
