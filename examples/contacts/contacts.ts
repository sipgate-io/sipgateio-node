import { createClient } from '../../lib/core/sipgateIOClient';
import { readFileSync } from 'fs';

const filePath = './contacts.csv';
const fileContent = readFileSync(filePath).toString();

const password = process.env.SIPGATE_PASSWORD || '';
const username = process.env.SIPGATE_USERNAME || '';

/**
 * See the example in examples/core/client.ts for how to connect to the client
 */
const client = createClient({ username, password });

client.contacts
	.importFromCsvString(fileContent)
	.then(() => {
		console.log('Contacts were imported successfully');
	})
	.catch(error => {
		console.error(error.message);
	});
