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
import { SipgateIOClient, TransferOptions, createRTCMModule } from '..';
import { WebhookErrorMessage } from './webhook.errors';
import { isSipgateSignature } from './signatureVerifier';
import { js2xml } from 'xml-js';
import { parse } from 'qs';
import { validateAnnouncementAudio } from './audioUtils';

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

const SIPGATE_IP_ADRESS = '217.116.118.254';

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
			const requestBody = await collectRequestData(req);
			if (!serverAddressesMatch(req, serverOptions)) {
				console.error(WebhookErrorMessage.SERVERADDRESS_DOES_NOT_MATCH);
			}
			if (!serverOptions.skipSignatureVerification) {
				if (!req.headers['x-forwarded-for']?.includes(SIPGATE_IP_ADRESS)) {
					console.error(WebhookErrorMessage.INVALID_ORIGIN);
					res.end(
						`<?xml version="1.0" encoding="UTF-8"?><Error message="${WebhookErrorMessage.INVALID_ORIGIN}" />`
					);
					return;
				}
				if (
					!isSipgateSignature(
						req.headers['x-sipgate-signature'] as string,
						requestBody
					)
				) {
					console.error(
						WebhookErrorMessage.SIPGATE_SIGNATURE_VERIFICATION_FAILED
					);
					res.end(
						`<?xml version="1.0" encoding="UTF-8"?><Error message="${WebhookErrorMessage.SIPGATE_SIGNATURE_VERIFICATION_FAILED}" />`
					);
					return;
				}
			}
			res.setHeader('Content-Type', 'application/xml');

			const requestBodyJSON = parseRequestBodyJSON(requestBody);
			const requestCallback = handlers[
				requestBodyJSON.event
			] as HandlerCallback<GenericEvent, ResponseObject | void>;

			if (requestCallback === undefined) {
				res.end(
					`<?xml version="1.0" encoding="UTF-8"?><Error message="No handler for ${requestBodyJSON.event} event" />`
				);
				return;
			}

			const callbackResult = requestCallback(requestBodyJSON) || undefined;

			const responseObject = createResponseObject(
				callbackResult instanceof Promise
					? await callbackResult
					: callbackResult,
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

const parseRequestBodyJSON = (body: string): CallEvent => {
	body = body
		.replace(/user%5B%5D/g, 'users%5B%5D')
		.replace(/userId%5B%5D/g, 'userIds%5B%5D')
		.replace(/fullUserId%5B%5D/g, 'fullUserIds%5B%5D')
		.replace(/origCallId/g, 'originalCallId');

	const parsedBody = parse(body) as unknown as CallEvent;
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

const collectRequestData = (request: IncomingMessage): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
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
			resolve(body);
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

export const serverAddressesMatch = (
	{ headers: { host }, url }: { headers: { host?: string }; url?: string },
	{ serverAddress }: { serverAddress: string }
): boolean => {
	const actual = new URL(`http://${host}${url}`);
	const expected = new URL(serverAddress);

	function paramsToObject(entries: IterableIterator<[string, string]>) {
		type KeyValueSet = { [shot: string]: string };
		const result: KeyValueSet = {};

		for (const [key, value] of entries) {
			result[key] = value;
		}
		return result;
	}

	return [
		actual.hostname === expected.hostname,
		actual.pathname === expected.pathname,
		JSON.stringify(paramsToObject(actual.searchParams.entries())) ===
			JSON.stringify(paramsToObject(expected.searchParams.entries())),
	].every((filter) => filter === true);
};

export const WebhookResponse: WebhookResponseInterface = {
	gatherDTMF: async (gatherOptions: GatherOptions): Promise<GatherObject> => {
		if (gatherOptions.maxDigits < 1) {
			throw new Error(
				`\n\n${WebhookErrorMessage.INVALID_DTMF_MAX_DIGITS}\nYour maxDigits was: ${gatherOptions.maxDigits}\n`
			);
		}
		if (gatherOptions.timeout < 0) {
			throw new Error(
				`\n\n${WebhookErrorMessage.INVALID_DTMF_TIMEOUT}\nYour timeout was: ${gatherOptions.timeout}\n`
			);
		}
		const gatherObject: GatherObject = {
			Gather: {
				_attributes: {
					maxDigits: String(gatherOptions.maxDigits),
					timeout: String(gatherOptions.timeout),
				},
			},
		};
		if (gatherOptions.announcement) {
			const validationResult = await validateAnnouncementAudio(
				gatherOptions.announcement
			);

			if (!validationResult.isValid) {
				throw new Error(
					`\n\n${
						WebhookErrorMessage.AUDIO_FORMAT_ERROR
					}\nYour format was: ${JSON.stringify(validationResult.metadata)}\n`
				);
			}

			gatherObject.Gather['Play'] = {
				Url: gatherOptions.announcement,
			};
		}
		return gatherObject;
	},
	hangUpCall: (): HangUpObject => {
		return { Hangup: {} };
	},
	playAudio: async (playOptions: PlayOptions): Promise<PlayObject> => {
		const validationResult = await validateAnnouncementAudio(
			playOptions.announcement
		);

		if (!validationResult.isValid) {
			throw new Error(
				`\n\n${
					WebhookErrorMessage.AUDIO_FORMAT_ERROR
				}\nYour format was: ${JSON.stringify(validationResult.metadata)}\n`
			);
		}

		return { Play: { Url: playOptions.announcement } };
	},

	playAudioAndHangUp: async (
		playOptions: PlayOptions,
		client: SipgateIOClient,
		callId: string,
		timeout?: number
	): Promise<PlayObject> => {
		const validationResult = await validateAnnouncementAudio(
			playOptions.announcement
		);

		if (!validationResult.isValid) {
			throw new Error(
				`\n\n${
					WebhookErrorMessage.AUDIO_FORMAT_ERROR
				}\nYour format was: ${JSON.stringify(validationResult.metadata)}\n`
			);
		}

		let duration = validationResult.metadata.duration
			? validationResult.metadata.duration * 1000
			: 0;

		duration += timeout ? timeout : 0;

		setTimeout(() => {
			const rtcm = createRTCMModule(client);
			// ignore errors, which were happening when the callee already hung up the phone before the announcement had ended
			rtcm.hangUp({ callId }).catch(() => {});
		}, duration);

		return { Play: { Url: playOptions.announcement } };
	},
	playAudioAndTransfer: async (
		playOptions: PlayOptions,
		transferOptions: TransferOptions,
		client: SipgateIOClient,
		callId: string,
		timeout?: number
	): Promise<PlayObject> => {
		const validationResult = await validateAnnouncementAudio(
			playOptions.announcement
		);

		if (!validationResult.isValid) {
			throw new Error(
				`\n\n${
					WebhookErrorMessage.AUDIO_FORMAT_ERROR
				}\nYour format was: ${JSON.stringify(validationResult.metadata)}\n`
			);
		}

		let duration = validationResult.metadata.duration
			? validationResult.metadata.duration * 1000
			: 0;

		duration += timeout ? timeout : 0;

		setTimeout(() => {
			const rtcm = createRTCMModule(client);
			// ignore errors, which were happening when the callee already hung up the phone before the announcement had ended
			rtcm.transfer({ callId }, transferOptions).catch(() => {});
		}, duration);

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
