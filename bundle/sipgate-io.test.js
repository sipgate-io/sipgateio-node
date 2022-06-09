/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { TextDecoder, TextEncoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('sipgate-io module', () => {
	let dom;
	let bundle;

	beforeAll(() => {
		const { JSDOM } = require('jsdom');
		const io = fs.readFileSync('./bundle/sipgate-io.min.js');
		const html = `<!DOCTYPE html><script>${io}</script>`;
		dom = new JSDOM(html, { runScripts: 'dangerously' });
		bundle = dom.window.require('sipgate-io');
	});

	it('should have a sipgateIO method', () => {
		expect(bundle.sipgateIO).toBeDefined();
	});
});

describe('sipgate-io client', () => {
	let dom;
	let bundle;
	let sipgateClient;

	beforeAll(() => {
		const { JSDOM } = require('jsdom');
		const io = fs.readFileSync('./bundle/sipgate-io.min.js');
		const html = `<!DOCTYPE html><script>${io}</script>`;
		dom = new JSDOM(html, { runScripts: 'dangerously' });
		bundle = dom.window.require('sipgate-io');
		sipgateClient = bundle.sipgateIO({
			username: 'dummy@sipgate.de',
			password: '1234',
		});
	});

	it('should contain a call module with an initiate function', () => {
		const call = bundle.createCallModule(sipgateClient);
		expect(call).toBeDefined();
		expect(call.initiate).toBeDefined();
		expect(typeof call.initiate).toEqual('function');
	});

	it('should contain a fax module with a send function', () => {
		const fax = bundle.createFaxModule(sipgateClient);
		expect(fax).toBeDefined();
		expect(fax.send).toBeDefined();
		expect(typeof fax.send).toEqual('function');
	});

	it('should contain a sms module with a send function', () => {
		const sms = bundle.createSMSModule(sipgateClient);
		expect(sms).toBeDefined();
		expect(sms.send).toBeDefined();
		expect(typeof sms.send).toEqual('function');
	});

	it('should contain a history module with a fetchById function', () => {
		const history = bundle.createHistoryModule(sipgateClient);
		expect(history).toBeDefined();
		expect(history.fetchById).toBeDefined();
		expect(typeof history.fetchById).toEqual('function');
	});

	it('should contain a settings module with a setIncomingUrl function', () => {
		const webhookSettings = bundle.createSettingsModule(sipgateClient);
		expect(webhookSettings.setIncomingUrl).toBeDefined();
		expect(typeof webhookSettings.setIncomingUrl).toEqual('function');
	});

	it('should contain a settings module with a setOutgoingUrl function', () => {
		const webhookSettings = bundle.createSettingsModule(sipgateClient);
		expect(webhookSettings.setOutgoingUrl).toBeDefined();
		expect(typeof webhookSettings.setOutgoingUrl).toEqual('function');
	});

	it('should contain a settings module with a setWhitelist function', () => {
		const webhookSettings = bundle.createSettingsModule(sipgateClient);
		expect(webhookSettings.setWhitelist).toBeDefined();
		expect(typeof webhookSettings.setWhitelist).toEqual('function');
	});

	it('should contain a settings module with a setLog function', () => {
		const webhookSettings = bundle.createSettingsModule(sipgateClient);
		expect(webhookSettings.setLog).toBeDefined();
		expect(typeof webhookSettings.setLog).toEqual('function');
	});

	it('should contain a settings module with a clearIncomingUrl function', () => {
		const webhookSettings = bundle.createSettingsModule(sipgateClient);
		expect(webhookSettings.clearIncomingUrl).toBeDefined();
		expect(typeof webhookSettings.clearIncomingUrl).toEqual('function');
	});

	it('should contain a settings module with a clearOutgoingUrl function', () => {
		const webhookSettings = bundle.createSettingsModule(sipgateClient);
		expect(webhookSettings.clearOutgoingUrl).toBeDefined();
		expect(webhookSettings.clearWhitelist).toBeDefined();
		expect(typeof webhookSettings.clearWhitelist).toEqual('function');
	});

	it('should contain a settings module with a disableWhitelist function', () => {
		const webhookSettings = bundle.createSettingsModule(sipgateClient);
		expect(webhookSettings.disableWhitelist).toBeDefined();
		expect(typeof webhookSettings.disableWhitelist).toEqual('function');
	});

	it('should contain a contacts module with function importFromCsvString', () => {
		const contacts = bundle.createContactsModule(sipgateClient);
		expect(contacts.importFromCsvString).toBeDefined();
		expect(typeof contacts.importFromCsvString).toEqual('function');
	});

	it('should contain the exported enums', () => {
		expect(bundle.HistoryEntryType).toBeDefined();
		expect(bundle.HistoryEntryType.FAX).toEqual('FAX');
	});

	it('should not contain a webhook module', () => {
		expect(bundle.createWebhookModule).toBeUndefined();
	});
});
