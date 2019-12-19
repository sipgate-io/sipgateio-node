import { ContactVCard } from './Address';
import vCard from 'vcf';

export const parseVCard = (vCardContent: string): ContactVCard => {
	let parsedVCard;
	try {
		parsedVCard = new vCard().parse(vCardContent);
	} catch (ex) {
		if (ex instanceof SyntaxError) {
			if (ex.message.includes('Expected "BEGIN:VCARD"')) {
				throw new Error('vCard does not contain a valid BEGIN tag');
			}
			if (ex.message.includes('Expected "END:VCARD"')) {
				throw new Error('vCard does not contain a valid END tag');
			}
		}

		throw new Error(ex);
	}
	if (parsedVCard.version !== '4.0') {
		throw new Error('Invalid VCard Version given');
	}

	const nameAttribute = parsedVCard.get('n');
	const phoneAttribute = parsedVCard.get('tel');
	const emailAttribute = parsedVCard.get('email');
	const addressAttribute = parsedVCard.get('adr');
	const organizationAttribute = parsedVCard.get('org');

	if (nameAttribute === undefined) {
		throw new Error('Names not given');
	}

	if (phoneAttribute === undefined) {
		throw new Error('No phone number given');
	}

	const names = nameAttribute
		.toString()
		.replace(/(.*)N(.*):/, '')
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
			.replace(/(.*)ADR(.*):/, '')
			.split(';');
	}

	validateAtLeastRequiredAddressLength(addressValues);
	validateAmountOfEmails(emailAttribute);

	let result: ContactVCard = {
		firstname,
		lastname,
		phoneNumber: phoneAttribute.valueOf().toString(),
		email: emailAttribute ? emailAttribute.valueOf().toString() : undefined,
		organization: organizationAttribute
			.toString()
			.replace(/(.*)ORG(.*):/, '')
			.split(';'),
	};

	if (addressAttribute) {
		result = {
			...result,
			address: {
				poBox: addressValues ? addressValues[0] : '',
				extendedAddress: addressValues ? addressValues[1] : '',
				streetAddress: addressValues ? addressValues[2] : '',
				locality: addressValues ? addressValues[3] : '',
				region: addressValues ? addressValues[4] : '',
				postalCode: addressValues ? addressValues[5] : '',
				country: addressValues ? addressValues[6] : '',
			},
		};
	}

	return result;
};

const validateAtLeastRequiredAddressLength = (
	addressValues: string[] | undefined
): void => {
	if (addressValues && addressValues.length < 7)
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
