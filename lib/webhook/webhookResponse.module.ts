import {
	GatherOptions,
	PlayOptions,
	RedirectOptions,
	RejectOptions,
} from './models/webhookResponse.model';

export interface WebhookResponse {
	redirectCall: (redirectOptions: RedirectOptions) => string;
	gatherDTMF: (gatherOptions: GatherOptions) => string;
	playAudio: (playOptions: PlayOptions) => string;
	rejectCall: (rejectOptions: RejectOptions) => string;
	hangupCall: () => string;
	sendToVoicemail: () => string;
}

export enum RejectReason {
	BUSY = 'busy',
	REJECTED = 'rejected',
}
