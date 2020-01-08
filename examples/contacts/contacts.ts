import { readFileSync } from 'fs';
import { sipgateIO } from '../../lib/core/sipgateIOClient';
import { vcardExample } from './vcard';

const filePath = './contacts.csv';
const fileContent = readFileSync(filePath).toString();

const password = process.env.SIPGATE_PASSWORD || '';
const username = process.env.SIPGATE_USERNAME || '';

/**
 * See the example in examples/core/client.ts for how to connect to the client
 */
const client = sipgateIO({ username, password });

client.contacts
	.importFromCsvString(fileContent)
	.then(() => {
		console.log('Contacts were imported successfully');
	})
	.catch(error => {
		console.error(error.message);
	});

client.contacts
	.import(
		{
			firstname: 'John',
			lastname: 'Doe',
			phone: { number: '+49123456789', type: ['HOME'] },
			address: {
				country: 'Germany',
				extendedAddress: 'Extended Address',
				locality: 'DE',
				poBox: 'Post Box',
				postalCode: '0000',
				region: 'region',
				streetAddress: 'street',
			},
			email: {
				email: 'John.Doe@example.org',
				type: ['HOME'],
			},
			organization: ['example', 'org'],
		},
		'PRIVATE'
	)
	.then(() => {
		console.log('Contact imported successfully');
	})
	.catch(error => {
		console.error(error.message);
	});

client.contacts
	.importVCardString(vcardExample, 'PRIVATE')
	.then(() => {
		console.log('Contact imported successfully');
	})
	.catch(error => {
		console.error(error.message);
	});

client.contacts
	.importVCardString(vcardExample, 'SHARED')
	.then(() => {
		console.log('Contact imported successfully');
	})
	.catch(error => {
		console.error(error.message);
	});

client.contacts
	.exportAsCsv('PRIVATE')
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error(error.message);
	});

client.contacts.exportAsVCards('SHARED').then(vCards => {
	vCards.map(vcard => {
		console.log(`${vcard}\n`);
	});
});
