import { CallEvent } from './models/webhook.model';
import {
	EventType,
	ServerSettings,
	WebhookModule,
	WebhookServer,
} from './webhook.module';
import { GatherObject, ResponseObject } from './models/webhookResponse.model';
import { IncomingMessage, OutgoingMessage, createServer } from 'http';
import { js2xml } from 'xml-js';
import { parse } from 'querystring';

export const createWebhookModule = (): WebhookModule => ({
	createServer: createWebhookServer,
});

const createWebhookServer = async (
	serverSettings: ServerSettings
): Promise<WebhookServer> => {
	const handlers = new Map<EventType, (event: any) => any>();
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

			if (callbackResult) {
				const responseObject = createResponseObject(
					callbackResult,
					serverSettings.serverAddress
				);
				const xmlResponse = createXmlResponse(responseObject);
				res.end(xmlResponse);
			}

			res.end();
		};

		const server = createServer(requestHandler).on('error', reject);

		server.listen(
			{
				port: serverSettings.port,
				hostname: serverSettings.hostname || 'localhost',
			},
			() => {
				resolve({
					onNewCall: handler => {
						handlers.set(EventType.NEW_CALL, handler);
					},
					onAnswer: handler => {
						handlers.set(EventType.ANSWER, handler);
					},
					onHangup: handler => {
						handlers.set(EventType.HANGUP, handler);
					},
					onData: handler => {
						handlers.set(EventType.DATA, handler);
					},
					stop: () => {
						if (server) {
							server.close();
						}
					},
				});
			}
		);
	});
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
		request.on('data', chunk => {
			body += chunk.toString();
		});
		request.on('end', () => {
			resolve((parse(body) as unknown) as CallEvent);
		});
	});
};

const createResponseObject = (
	responseObject: ResponseObject,
	serverAddress: string
) => {
	if (responseObject && isGatherObject(responseObject)) {
		responseObject.Gather._attributes['onData'] = serverAddress;
	}

	return {
		_declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
		Response: {
			_attributes: {
				onAnswer: serverAddress,
				onHangup: serverAddress,
			},
			...responseObject,
		},
	};
};

const createXmlResponse = (responseObject: any): string => {
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
