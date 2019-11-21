import * as fs from 'fs';
import { createClient } from '../../lib/core/sipgateClient';

const filePath = './contacts.csv';
const fileContent = fs.readFileSync(filePath).toString();

const password = process.env.SIPGATE_PASSWORD || '';
const username = process.env.SIPGATE_USERNAME || '';

const client = createClient({ username, password });

client.contacts
	.importFromCsvString(fileContent)
	.then(() => {
		console.log('Contacts were imported successfully');
	})
	.catch(error => {
		console.error(error.message);
	});
