import { CallEvent } from './models/webhook.model';
import { EventType, WebhookModule, WebhookServer } from './webhook.module';
import { IncomingMessage, OutgoingMessage, createServer } from 'http';
import { JSDOM } from 'jsdom';
import { parse } from 'querystring';

export const createWebhookModule = (): WebhookModule => ({
	createServer: createWebhookServer,
});

const createWebhookServer = async (
	port: number,
	hostname = 'localhost'
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

			const xmlResponse = requestCallback(requestBody);

			try {
				new JSDOM(xmlResponse, { contentType: 'application/xml' });
				res.end(xmlResponse);
			} catch (error) {
				res.end(
					`<?xml version="1.0" encoding="UTF-8"?><Error message="XML parse error: ${error}" />`
				);
			}
		};

		const server = createServer(requestHandler).on('error', reject);

		server.listen({ port, hostname }, () => {
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
		});
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
