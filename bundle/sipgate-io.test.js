const fs = require('fs');

describe('sipgate-io module', () => {

	let dom;
	let bundle;

	beforeAll(() => {
		const {JSDOM} = require('jsdom');
		let io = fs.readFileSync('./bundle/sipgate-io.js');
		let html = `<!DOCTYPE html><script>${io}</script>`;
		dom = new JSDOM(html, {runScripts: 'dangerously'});
		bundle = dom.window.require('sipgate-io');
	});

	it('should have a createClient method', () => {
		expect(bundle.createClient).toBeDefined();
	});

});

describe('sipgate-io client', () => {

	let dom;
	let bundle;
	let sipgateClient;

	beforeAll(() => {
		const {JSDOM} = require('jsdom');
		let io = fs.readFileSync('./bundle/sipgate-io.js');
		let html = `<!DOCTYPE html><script>${io}</script>`;
		dom = new JSDOM(html, {runScripts: 'dangerously'});
		bundle = dom.window.require('sipgate-io');
		sipgateClient = bundle.createClient('dummy@sipgate.de', '1234');
	});

	it('should contain a call module with an initiate method', () => {
		expect(sipgateClient.call).toBeDefined();
		expect(sipgateClient.call.initiate).toBeDefined();
		expect(typeof (sipgateClient.call.initiate)).toEqual('function');
	});

	it('should contain a fax module with a send method', () => {
		expect(sipgateClient.fax).toBeDefined();
		expect(sipgateClient.fax.send).toBeDefined();
		expect(typeof (sipgateClient.fax.send)).toEqual('function');
	});

	it('should contain a sms module with a send method', () => {
		expect(sipgateClient.sms).toBeDefined();
		expect(sipgateClient.sms.send).toBeDefined();
		expect(typeof (sipgateClient.sms.send)).toEqual('function');
	});

	it('should contain a settings module with a setIncomingUrl', () => {
		expect(sipgateClient.settings).toBeDefined();
		expect(sipgateClient.settings.setIncomingUrl).toBeDefined();
		expect(typeof (sipgateClient.settings.setIncomingUrl)).toEqual('function');
	});

	it('should contain a settings module with a setOutgoingUrl', () => {
		expect(sipgateClient.settings).toBeDefined();
		expect(sipgateClient.settings.setOutgoingUrl).toBeDefined();
		expect(typeof (sipgateClient.settings.setOutgoingUrl)).toEqual('function');
	});

	it('should contain a settings module with a setWhitelist', () => {
		expect(sipgateClient.settings).toBeDefined();
		expect(sipgateClient.settings.setWhitelist).toBeDefined();
		expect(typeof (sipgateClient.settings.setWhitelist)).toEqual('function');
	});

	it('should contain a settings module with a setLog', () => {
		expect(sipgateClient.settings).toBeDefined();
		expect(sipgateClient.settings.setLog).toBeDefined();
		expect(typeof (sipgateClient.settings.setLog)).toEqual('function');
	});

	it('should contain a settings module with a clearIncomingUrl', () => {
		expect(sipgateClient.settings).toBeDefined();
		expect(sipgateClient.settings.clearIncomingUrl).toBeDefined();
		expect(typeof (sipgateClient.settings.clearIncomingUrl)).toEqual('function');
	});

	it('should contain a settings module with a clearOutgoingUrl', () => {
		expect(sipgateClient.settings).toBeDefined();
		expect(sipgateClient.settings.clearOutgoingUrl).toBeDefined();
		expect(typeof (sipgateClient.settings.clearOutgoingUrl)).toEqual('function');
	});
});