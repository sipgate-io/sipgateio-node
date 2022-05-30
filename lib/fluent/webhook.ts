import {
	AnswerCallback,
	DataCallback,
	HangUpCallback,
	NewCallCallback,
} from '../webhook';
import { createWebhookModule } from '..';

class FluentWebhookServer {
	private serverAddress: string = '';
	private serverPort: number = -1;

	private newCallCallback: NewCallCallback | null = null;
	private answerCallback: AnswerCallback | null = null;
	private hangupCallback: HangUpCallback | null = null;
	private dataCallback: DataCallback | null = null;

	public setServerAddress = (address: string) => {
		this.serverAddress = address;

		return this;
	};

	public setServerPort = (port: number) => {
		this.serverPort = port;

		return this;
	};

	public setOnNewCallListener = (fn: NewCallCallback) => {
		if (this.newCallCallback !== null) {
			throw new Error('can only handle one newCall listener');
		}

		this.newCallCallback = fn;

		return this;
	};

	public setOnAnswerListener = (fn: AnswerCallback) => {
		if (this.answerCallback !== null) {
			throw new Error('can only handle one answer listener');
		}

		this.answerCallback = fn;

		return this;
	};

	public setOnHangupListener = (fn: HangUpCallback) => {
		if (this.hangupCallback !== null) {
			throw new Error('can only handle one hangup listener');
		}

		this.hangupCallback = fn;

		return this;
	};

	public setOnDataListener = (fn: DataCallback) => {
		if (this.dataCallback !== null) {
			throw new Error('can only handle one data listener');
		}

		this.dataCallback = fn;

		return this;
	};

	public async startServer() {
		if (this.serverPort < 0) {
			throw new Error('invalid or missing serverPort');
		}

		if (this.serverAddress.length === 0) {
			throw new Error('invalid or missing serverAddress');
		}

		const server = await createWebhookModule().createServer({
			port: this.serverPort,
			serverAddress: this.serverAddress,
		});

		if (this.newCallCallback !== null) {
			server.onNewCall(this.newCallCallback);
		}
		if (this.answerCallback !== null) {
			server.onAnswer(this.answerCallback);
		}
		if (this.hangupCallback !== null) {
			server.onHangUp(this.hangupCallback);
		}
		if (this.dataCallback !== null) {
			server.onData(this.dataCallback);
		}

		return server;
	}
}

export { FluentWebhookServer };
