import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '../../lib/core/sipgateClient';

const password = process.env.SIPGATE_PASSWORD || '';
const username = process.env.SIPGATE_USERNAME || '';

const client = createClient(username, password);

const faxlineId = process.env.SIPGATE_FAX_EXTENSION || '';
const recipient = process.env.SIPGATE_FAX_RECIPIENT || '';
const filePath = './testpage.pdf';
const { name: filename } = path.parse(path.basename(filePath));
const fileContent = fs.readFileSync(filePath);

client.fax
	.send({ recipient, fileContent, filename, faxlineId })
	.then(() => {
		console.log('Fax sent');
	})
	.catch(error => {
		console.error(error.message);
	});
