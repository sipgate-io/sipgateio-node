import { ContactVCard } from './Address';
import vCard from 'vcf';

export const parseVCard = (vCardContent: string): ContactVCard => {
	const parsedVCard = new vCard().parse(vCardContent);

	if (parsedVCard.version !== '4.0') {
		throw new Error('Invalid VCard Version given');
	}

	const nameAttribute = parsedVCard.get('n');
	const phoneAttribute = parsedVCard.get('tel');
	const emailAttribute = parsedVCard.get('email');
	const addressAttribute = parsedVCard.get('adr');

	if (nameAttribute === undefined) {
		throw new Error('Names not given');
	}

	if (phoneAttribute === undefined) {
		throw new Error('No phone number given');
	}

	const names = nameAttribute
		.toString()
		.replace('N:', '')
		.split(';');

	validateAmountOfNames(names);

	const lastname = names[0];
	const firstname = names[1];

	validateAmountOfPhoneNumbers(phoneAttribute);
	validateAmountOfAddresses(addressAttribute);

	let addressValues;
	if (addressAttribute) {
		addressValues = addressAttribute
			.toString()
			.replace('ADR:', '')
			.split(';');
	}

	validateAmountOfEmails(emailAttribute);
	validateAtLeastRequiredAddressLength(addressValues);

	return {
		firstname,
		lastname,
		phoneNumber: phoneAttribute.valueOf().toString(),
		email: emailAttribute ? emailAttribute.valueOf().toString() : undefined,
		address: {
			streetAddress: addressValues ? addressValues[3] : undefined,
			locality: addressValues ? addressValues[4] : undefined,
			region: addressValues ? addressValues[5] : undefined,
			postalCode: addressValues ? addressValues[6] : undefined,
			country: addressValues ? addressValues[7] : undefined,
		},
	};
};

const validateAtLeastRequiredAddressLength = (
	addressValues: string[] | undefined
): void => {
	if (addressValues && addressValues.length < 8)
		throw new Error('Address Fields are invalid');
};

const validateAmountOfAddresses = (
	addressAttribute: vCard.Property | vCard.Property[]
): void => {
	if (addressAttribute && typeof addressAttribute.valueOf() === 'object')
		throw new Error('Only one address is allowed');
};

const validateAmountOfEmails = (
	emailAttribute: vCard.Property | vCard.Property[]
): void => {
	if (emailAttribute && typeof emailAttribute.valueOf() === 'object')
		throw new Error('Only one email is allowed');
};

const validateAmountOfPhoneNumbers = (
	phoneAttribute: vCard.Property | vCard.Property[]
): void => {
	if (typeof phoneAttribute.valueOf() === 'object')
		throw new Error('Only one phone number is allowed');
};

const validateAmountOfNames = (names: string[]): void => {
	if (names.length < 2) throw new Error('Missing Name Fields');
};
