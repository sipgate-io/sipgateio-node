import * as fs from 'fs';
import * as path from 'path';
import { createFaxModule } from '../../lib/fax';
import { sipgateIO } from '../../lib/core/sipgateIOClient';

(async (): Promise<void> => {
	const password = process.env.SIPGATE_PASSWORD || '';
	const username = process.env.SIPGATE_USERNAME || '';

	/**
	 *
	 * For details on how to instantiate the client, see 'examples/client/client.ts'
	 */
	const client = sipgateIO({ username, password });

	const faxlineId = process.env.SIPGATE_FAX_EXTENSION || '';
	const to = process.env.SIPGATE_FAX_RECIPIENT || '';

	const filePath = './testpage.pdf';
	const { name: filename } = path.parse(path.basename(filePath));
	const fileContent = fs.readFileSync(filePath);

	const fax = createFaxModule(client);

	const faxSendResponsePromise = fax.send({
		to,
		fileContent,
		filename,
		faxlineId,
	});

	faxSendResponsePromise
		.then(sendFaxResponse => {
			console.log(`Fax sent with id: ${sendFaxResponse.sessionId}`);
			const faxStatusPromise = fax.getFaxStatus(sendFaxResponse.sessionId);
			faxStatusPromise
				.then(faxStatus => {
					console.log(`Fax status: ${faxStatus}`);
				})
				.catch(error => {
					console.error('Fax status could not be retrieved: ', error);
				});
		})
		.catch(error => {
			console.error('Fax could not be sent with Error: ', error);
		});
})();
