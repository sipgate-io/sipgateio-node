export type RedirectOptions = {
	numbers: string[];
	anonymous?: boolean;
	callerId?: string;
};

export type GatherOptions = {
	announcement?: string;
	maxDigits: number;
	timeout: number;
};

export type PlayOptions = {
	announcement: string;
};

export type RejectOptions = {
	reason: string;
};

export type RedirectObject = {
	Dial: {
		_attributes: { callerId?: string; anonymous?: string };
		Number: string[];
	};
};

export type GatherObject = {
	Gather: {
		_attributes: { onData?: string; maxDigits?: string; timeout?: string };
		Play?: { Url: string };
	};
};

export type PlayObject = {
	Play: { Url: string };
};

export type RejectObject = {
	Reject: { _attributes: { reason?: string } };
};

export type HangupObject = {
	Hangup: {};
};

export type VoicemailObject = {
	Dial: { Voicemail: {} };
};
