import { CallEvent } from './models/webhook.model';
import {
	EventType,
	HandlerCallback,
	WebhookModule,
	WebhookServer,
} from './webhook.module';
import { IncomingMessage, OutgoingMessage, Server, createServer } from 'http';
import { JSDOM } from 'jsdom';
import { parse } from 'querystring';

export const createWebhookModule = (): WebhookModule => ({
	createServer: createWebhookServer,
});

const handlers = new Map<EventType, HandlerCallback>([
	[
		EventType.UNUSED,
		(): string => '<?xml version="1.0" encoding="UTF-8"?><Response />',
	],
]);

let server: Server | undefined = undefined;

const createWebhookServer = async (
	port: number,
	hostname = 'localhost'
): Promise<WebhookServer> => {
	return new Promise((resolve, reject) => {
		const requestHandler = (
			req: IncomingMessage,
			res: OutgoingMessage
		): void => {
			const type = getEventTypeFromRequest(req);
			const handler = getHandlerFromEventType(type, handlers);

			collectRequestData(req, body => {
				const xmlResponse = handler(body as CallEvent);
				try {
					new JSDOM(xmlResponse, { contentType: 'application/xml' });
					res.setHeader('Content-Type', 'application/xml');
					res.end(xmlResponse);
				} catch (error) {
					console.log(error);
					res.setHeader('Content-Type', 'application/xml');
					res.end('<?xml version="1.0" encoding="UTF-8"?><Response />');
				}
			});
		};

		server = createServer(requestHandler).on('error', reject);
		server.listen({ port, hostname }, () => {
			resolve({
				on: (eventType, handler): void => {
					handlers.set(eventType, handler);
				},
			});
		});
	});
};

const getEventTypeFromRequest = (req: IncomingMessage): EventType => {
	if (req.url === undefined || !requestUrlToEventTypeMapping.has(req.url)) {
		return EventType.UNUSED;
	}
	return requestUrlToEventTypeMapping.get(req.url) as EventType;
};

const getHandlerFromEventType = (
	type: EventType,
	handlers: Map<EventType, HandlerCallback>
): HandlerCallback => {
	if (type === EventType.UNUSED || !handlers.has(type)) {
		return handlers.get(EventType.UNUSED) as HandlerCallback;
	}
	return handlers.get(type) as HandlerCallback;
};

const requestUrlToEventTypeMapping = new Map<string, EventType>([
	['/newCall', EventType.NEW_CALL],
	['/onAnswer', EventType.ANSWER],
	['/onHangup', EventType.HANGUP],
	['/onData', EventType.DATA],
]);

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
