import {
	CallEvent,
	EventType,
	GatherObject,
	GatherOptions,
	GenericEvent,
	HandlerCallback,
	HangUpObject,
	PlayObject,
	PlayOptions,
	RedirectObject,
	RedirectOptions,
	RejectObject,
	RejectOptions,
	ResponseObject,
	ServerOptions,
	VoicemailObject,
	WebhookHandlers,
	WebhookModule,
	WebhookResponseInterface,
	WebhookServer,
} from './webhook.types';
import { IncomingMessage, OutgoingMessage, createServer } from 'http';
import { WebhookErrorMessage } from './webhook.errors';
import { js2xml } from 'xml-js';
import { parse } from 'qs';
import { validateAudio } from './audioUtils';

interface WebhookApiResponse {
	_declaration: {
		_attributes: {
			version: string;
			encoding: string;
		};
	};
	Response:
		| ({ _attributes: Record<string, string> } & ResponseObject)
		| { _attributes: Record<string, string> };
}

export const createWebhookModule = (): WebhookModule => ({
	createServer: createWebhookServer,
});

const createWebhookServer = async (
	serverOptions: ServerOptions
): Promise<WebhookServer> => {
	const handlers: WebhookHandlers = {
		[EventType.NEW_CALL]: () => {
			return;
		},
	};

	return new Promise((resolve, reject) => {
		const requestHandler = async (
			req: IncomingMessage,
			res: OutgoingMessage
		): Promise<void> => {
			res.setHeader('Content-Type', 'application/xml');

			const requestBody = await collectRequestData(req);
			const requestCallback = handlers[requestBody.event] as HandlerCallback<
				GenericEvent,
				ResponseObject | void
			>;

			if (requestCallback === undefined) {
				res.end(
					`<?xml version="1.0" encoding="UTF-8"?><Error message="No handler for ${requestBody.event} event" />`
				);
				return;
			}

			const callbackResult = requestCallback(requestBody) || undefined;

			const responseObject = createResponseObject(
				callbackResult,
				serverOptions.serverAddress
			);

			if (handlers[EventType.ANSWER]) {
				responseObject.Response['_attributes'].onAnswer =
					serverOptions.serverAddress;
			}

			if (handlers[EventType.HANGUP]) {
				responseObject.Response['_attributes'].onHangup =
					serverOptions.serverAddress;
			}

			const xmlResponse = createXmlResponse(responseObject);
			res.end(xmlResponse);
		};

		const server = createServer(requestHandler).on('error', reject);

		server.listen(
			{
				port: serverOptions.port,
				hostname: serverOptions.hostname || 'localhost',
			},
			() => {
				resolve({
					onNewCall: (handler) => {
						handlers[EventType.NEW_CALL] = handler;
					},
					onAnswer: (handler) => {
						if (!serverOptions.serverAddress)
							throw new Error(
								WebhookErrorMessage.SERVERADDRESS_MISSING_FOR_FOLLOWUPS
							);
						handlers[EventType.ANSWER] = handler;
					},
					onHangUp: (handler) => {
						if (!serverOptions.serverAddress)
							throw new Error(
								WebhookErrorMessage.SERVERADDRESS_MISSING_FOR_FOLLOWUPS
							);
						handlers[EventType.HANGUP] = handler;
					},
					onData: (handler) => {
						if (!serverOptions.serverAddress)
							throw new Error(
								WebhookErrorMessage.SERVERADDRESS_MISSING_FOR_FOLLOWUPS
							);
						handlers[EventType.DATA] = handler;
					},
					stop: () => {
						if (server) {
							server.close();
						}
					},
					getHttpServer: () => server,
				});
			}
		);
	});
};

const parseRequestBody = (body: string): CallEvent => {
	body = body
		.replace(/user%5B%5D/g, 'users%5B%5D')
		.replace(/userId%5B%5D/g, 'userIds%5B%5D')
		.replace(/fullUserId%5B%5D/g, 'fullUserIds%5B%5D')
		.replace(/origCallId/g, 'originalCallId');

	const parsedBody = (parse(body) as unknown) as CallEvent;
	if ('from' in parsedBody && parsedBody.from !== 'anonymous') {
		parsedBody.from = `+${parsedBody.from}`;
	}
	if ('to' in parsedBody && parsedBody.to !== 'anonymous') {
		parsedBody.to = `+${parsedBody.to}`;
	}
	if ('diversion' in parsedBody && parsedBody.diversion !== 'anonymous') {
		parsedBody.diversion = `+${parsedBody.diversion}`;
	}
	if (
		'answeringNumber' in parsedBody &&
		parsedBody.answeringNumber !== 'anonymous'
	) {
		parsedBody.answeringNumber = `+${parsedBody.answeringNumber}`;
	}

	return parsedBody;
};

const collectRequestData = (request: IncomingMessage): Promise<CallEvent> => {
	return new Promise<CallEvent>((resolve, reject) => {
		if (
			request.headers['content-type'] &&
			!request.headers['content-type'].includes(
				'application/x-www-form-urlencoded'
			)
		) {
			reject();
		}

		let body = '';
		request.on('data', (chunk) => {
			body += chunk.toString();
		});
		request.on('end', () => {
			resolve(parseRequestBody(body));
		});
	});
};

const createResponseObject = (
	responseObject: ResponseObject | undefined,
	serverAddress: string
): WebhookApiResponse => {
	if (responseObject && isGatherObject(responseObject)) {
		responseObject.Gather._attributes['onData'] = serverAddress;
	}
	return {
		_declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
		Response: {
			_attributes: {},
			...responseObject,
		},
	};
};

const createXmlResponse = (responseObject: WebhookApiResponse): string => {
	const options = {
		compact: true,
		ignoreComment: true,
		spaces: 4,
	};
	return js2xml(responseObject, options);
};

const isGatherObject = (
	gatherCandidate: ResponseObject
): gatherCandidate is GatherObject => {
	return (gatherCandidate as GatherObject)?.Gather !== undefined;
};

export const WebhookResponse: WebhookResponseInterface = {
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
	hangUpCall: (): HangUpObject => {
		return { Hangup: {} };
	},
	playAudio: (playOptions: PlayOptions): PlayObject => {
		validateAudio(playOptions.announcement, {
			container: 'WAVE',
			codec: 'PCM',
			bitsPerSample: 16,
			sampleRate: 8000,
			numberOfChannels: 1,
		}).then((isValidAudio) => {
			if (!isValidAudio) {
				throw new Error('Invalid file format.');
			}
		});
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
	rejectCall: (rejectOptions: RejectOptions): RejectObject => {
		return { Reject: { _attributes: { reason: rejectOptions.reason } } };
	},

	sendToVoicemail: (): VoicemailObject => {
		return { Dial: { Voicemail: {} } };
	},
};
