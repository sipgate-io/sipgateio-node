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
import { js2xml } from 'xml-js';

export const WebhookResponse: WebhookResponseType = {
	gatherDTMF: (gatherOptions: GatherOptions): string => {
		return createXmlResponse(createGatherObject(gatherOptions));
	},
	hangupCall: (): string => {
		return createXmlResponse(createHangupObject());
	},
	playAudio: (playOptions: PlayOptions): string => {
		return createXmlResponse(createPlayObject(playOptions));
	},

	redirectCall: (redirectOptions: RedirectOptions): string => {
		return createXmlResponse(createRedirectObject(redirectOptions));
	},
	rejectCall: (rejectOptions: RejectOptions): string => {
		return createXmlResponse(createRejectObject(rejectOptions));
	},

	sendToVoicemail: (): string => {
		return createXmlResponse(createVoicemailObject());
	},
};

export function createGatherObject(gatherOptions: GatherOptions): GatherObject {
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
}

function createHangupObject(): HangupObject {
	return { Hangup: {} };
}

function createPlayObject(playOptions: PlayOptions): PlayObject {
	return { Play: { Url: playOptions.announcement } };
}

function createRedirectObject(
	redirectOptions: RedirectOptions
): RedirectObject {
	return {
		Dial: {
			_attributes: {
				callerId: redirectOptions.callerId,
				anonymous: String(redirectOptions.anonymous),
			},
			Number: redirectOptions.numbers,
		},
	};
}

function createRejectObject(rejectOptions: RejectOptions): RejectObject {
	return { Reject: { _attributes: { reason: rejectOptions.reason } } };
}

function createVoicemailObject(): VoicemailObject {
	return { Dial: { Voicemail: {} } };
}

function createXmlResponse(responseObject: any): string {
	const jsObject = {
		_declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
		Response: responseObject,
	};
	const options = {
		compact: true,
		ignoreComment: true,
		spaces: 4,
	};
	return js2xml(jsObject, options);
}
