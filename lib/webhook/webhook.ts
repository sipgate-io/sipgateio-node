import {
	EventType,
	HandlerCallback,
	WebhookModule,
	WebhookServer,
} from './webhook.module';
import { IncomingMessage, OutgoingMessage, createServer } from 'http';
import { JSDOM } from 'jsdom';

export const createWebhookModule = (): WebhookModule => ({
	handlers: new Map<EventType, HandlerCallback>([
		[
			EventType.UNUSED,
			(): string => '<?xml version="1.0" encoding="UTF-8"?><Response />',
		],
	]),
	server: undefined,
	async createServer(
		port: number,
		hostname = 'localhost'
	): Promise<WebhookServer> {
		return new Promise((resolve, reject) => {
			const requestHandler = (
				req: IncomingMessage,
				res: OutgoingMessage
			): void => {
				const type = getEventTypeFromRequest(req);
				const handler = getHandlerFromEventType(type, this.handlers);
				const xmlResponse = handler();
				try {
					new JSDOM(xmlResponse, { contentType: 'application/xml' });
					res.end(xmlResponse);
				} catch (error) {
					console.log(error);
					res.end('');
				}
			};

			this.server = createServer(requestHandler).on('error', reject);
			this.server.listen({ port, hostname }, () => {
				resolve({
					on: (eventType, handler): void => {
						this.handlers.set(eventType, handler);
					},
				});
			});
		});
	},
});

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
	['/onAnswer', EventType.ON_ANSWER],
	['/onHangup', EventType.ON_HANGUP],
	['/onData', EventType.ON_DATA],
]);
