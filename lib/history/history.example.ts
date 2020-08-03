import { createHistoryModule, sipgateIO } from '..';
import { HistoryEntryType } from './history.types';

const client = sipgateIO({
	username: process.env.SIPGATE_USERNAME || '',
	password: process.env.SIPGATE_PASSWORD || '',
});

createHistoryModule(client)
	.fetchAll({ types: [HistoryEntryType.SMS] })
	.then((events) => {
		events.forEach((event) => {
			if (event.type === HistoryEntryType.SMS) {
				console.log(event.smsContent);
			}
		});
	});
