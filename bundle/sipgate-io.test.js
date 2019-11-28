const fs = require('fs');

describe('sipgate-io module', () => {
	let dom;
	let bundle;

	beforeAll(() => {
		const { JSDOM } = require('jsdom');
		const io = fs.readFileSync('./bundle/sipgate-io.js');
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
		const io = fs.readFileSync('./bundle/sipgate-io.js');
		const html = `<!DOCTYPE html><script>${io}</script>`;
		dom = new JSDOM(html, { runScripts: 'dangerously' });
		bundle = dom.window.require('sipgate-io');
		sipgateClient = bundle.sipgateIO({
			username: 'dummy@sipgate.de',
			password: '1234',
		});
	});

	it('should contain a call module with an initiate function', () => {
		expect(sipgateClient.call).toBeDefined();
		expect(sipgateClient.call.initiate).toBeDefined();
		expect(typeof sipgateClient.call.initiate).toEqual('function');
	});

	it('should contain a fax module with a send function', () => {
		expect(sipgateClient.fax).toBeDefined();
		expect(sipgateClient.fax.send).toBeDefined();
		expect(typeof sipgateClient.fax.send).toEqual('function');
	});

	it('should contain a sms module with a send function', () => {
		expect(sipgateClient.sms).toBeDefined();
		expect(sipgateClient.sms.send).toBeDefined();
		expect(typeof sipgateClient.sms.send).toEqual('function');
	});

	it('should contain a settings module with a setIncomingUrl function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.setIncomingUrl).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.setIncomingUrl).toEqual(
			'function'
		);
	});

	it('should contain a settings module with a setOutgoingUrl function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.setOutgoingUrl).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.setOutgoingUrl).toEqual(
			'function'
		);
	});

	it('should contain a settings module with a setWhitelist function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.setWhitelist).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.setWhitelist).toEqual(
			'function'
		);
	});

	it('should contain a settings module with a setLog function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.setLog).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.setLog).toEqual('function');
	});

	it('should contain a settings module with a clearIncomingUrl function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.clearIncomingUrl).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.clearIncomingUrl).toEqual(
			'function'
		);
	});

	it('should contain a settings module with a clearOutgoingUrl function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.clearOutgoingUrl).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.clearOutgoingUrl).toEqual(
			'function'
		);
	});

	it('should contain a settings module with a clearWhitelist function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.clearWhitelist).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.clearWhitelist).toEqual(
			'function'
		);
	});

	it('should contain a settings module with a disableWhitelist function', () => {
		expect(sipgateClient.webhookSettings).toBeDefined();
		expect(sipgateClient.webhookSettings.disableWhitelist).toBeDefined();
		expect(typeof sipgateClient.webhookSettings.disableWhitelist).toEqual(
			'function'
		);
	});

	it('should contain a contacts module with function importFromCsvString', () => {
		expect(sipgateClient.contacts).toBeDefined();
		expect(sipgateClient.contacts.importFromCsvString).toBeDefined();
		expect(typeof sipgateClient.contacts.importFromCsvString).toEqual(
			'function'
		);
	});
});
