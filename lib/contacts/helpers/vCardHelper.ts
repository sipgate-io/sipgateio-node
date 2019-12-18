import vCard from 'vcf';

export interface Address {
	streetAddress: string;
	locality: string;
	region: string;
	postalCode: string;
	country: string;
}

interface ContactVCard {
	firstname: string;
	lastname: string;
	phoneNumber: string;
	email?: string;
	address: Address;
}
export const parseVCard = (vCardContent: string): ContactVCard => {
	const parsedVCard = new vCard().parse(vCardContent);
	//	console.log(parsedVCard);

	if (parsedVCard.version !== '4.0') {
		throw new Error('Invalid VCard Version given');
	}

	const nameAttribute = parsedVCard.get('n');
	const telAttribute = parsedVCard.get('tel');
	const emailAttribute = parsedVCard.get('email');
	const addrAttribute = parsedVCard.get('adr');

	if (nameAttribute === undefined) {
		throw new Error('Names not given');
	}

	if (telAttribute === undefined) {
		throw new Error('No phone number given');
	}

	const names = nameAttribute
		.toString()
		.replace('N:', '')
		.split(';');

	if (names.length < 2) {
		throw new Error('Missing Name Fields');
	}

	const firstname = names[1];
	const lastname = names[0];

	// Check if multiple numbers are passed in the vCard
	if (typeof telAttribute.valueOf() === 'object') {
		throw new Error('Only one phone number is allowed');
	}

	if (addrAttribute && typeof addrAttribute.valueOf() === 'object') {
		throw new Error('Only one address is allowed');
	}
	let addressValues;
	if (addrAttribute) {
		addressValues = addrAttribute
			.toString()
			.replace('ADR:', '')
			.split(';');
	}

	if (emailAttribute && typeof emailAttribute.valueOf() === 'object') {
		throw new Error('Only one email is allowed');
	}

	if (!addressValues || addressValues.length < 8) {
		throw new Error('Address Fields are invalid');
	}

	return {
		firstname,
		lastname,
		phoneNumber: telAttribute.valueOf().toString(),
		email: emailAttribute ? emailAttribute.valueOf().toString() : undefined,
		address: {
			streetAddress: addressValues[3],
			locality: addressValues[4],
			region: addressValues[5],
			postalCode: addressValues[6],
			country: addressValues[7],
		},
	};
};
