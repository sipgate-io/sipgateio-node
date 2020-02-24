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
	const handlers = new Map<EventType, (event: any) => string>();

	return new Promise((resolve, reject) => {
		const requestHandler = (
			req: IncomingMessage,
			res: OutgoingMessage
		): void => {
			res.setHeader('Content-Type', 'application/xml');

			collectRequestData(req, body => {
				const requestBody = body as CallEvent;

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
					console.log(error);
					res.end(
						`<?xml version="1.0" encoding="UTF-8"?><Error message="XML parse error: ${error}" />`
					);
				}
			});
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

const collectRequestData = (
	request: IncomingMessage,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (obj: any) => void
): void => {
	const FORM_URLENCODED = 'application/x-www-form-urlencoded';
	if (request.headers['content-type'] === FORM_URLENCODED) {
		let body = '';
		request.on('data', chunk => {
			body += chunk.toString();
		});
		request.on('end', () => {
			callback(parse(body));
		});
	} else {
		callback(null);
	}
};
