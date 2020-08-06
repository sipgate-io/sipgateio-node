import {
	CallEvent,
	EventType,
	GatherObject,
	GatherOptions,
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
	WebhookModule,
	WebhookResponseInterface,
	WebhookServer,
} from './webhook.types';
import { IncomingMessage, OutgoingMessage, createServer } from 'http';
import { js2xml } from 'xml-js';
import { parse } from 'qs';

export const createWebhookModule = (): WebhookModule => ({
	createServer: createWebhookServer,
});

const createWebhookServer = async (
	serverOptions: ServerOptions
): Promise<WebhookServer> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handlers = new Map<EventType, (event: any) => any>();

	handlers.set(EventType.NEW_CALL, () => null);

	return new Promise((resolve, reject) => {
		const requestHandler = async (
			req: IncomingMessage,
			res: OutgoingMessage
		): Promise<void> => {
			res.setHeader('Content-Type', 'application/xml');

			const requestBody = await collectRequestData(req);
			const requestCallback = handlers.get(requestBody.event);
			if (requestCallback === undefined) {
				res.end(
					`<?xml version="1.0" encoding="UTF-8"?><Error message="No handler for ${requestBody.event} event" />`
				);
				return;
			}

			const callbackResult = requestCallback(requestBody);

			const responseObject = createResponseObject(
				callbackResult,
				serverOptions.serverAddress
			);

			if (handlers.has(EventType.ANSWER)) {
				responseObject.Response['_attributes'].onAnswer =
					serverOptions.serverAddress;
			}

			if (handlers.has(EventType.HANGUP)) {
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
						handlers.set(EventType.NEW_CALL, handler);
					},
					onAnswer: (handler) => {
						handlers.set(EventType.ANSWER, handler);
					},
					onHangUp: (handler) => {
						handlers.set(EventType.HANGUP, handler);
					},
					onData: (handler) => {
						handlers.set(EventType.DATA, handler);
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
		.replace('user%5B%5D', 'users%5B%5D')
		.replace('userId%5B%5D', 'userIds%5B%5D')
		.replace('fullUserId%5B%5D', 'fullUserIds%5B%5D');

	return parse(body) as CallEvent;
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
	responseObject: ResponseObject,
	serverAddress: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createXmlResponse = (responseObject: Record<string, any>): string => {
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
