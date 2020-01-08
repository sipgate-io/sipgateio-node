import { ContactImport, ContactVCard } from './Address';
import { ErrorMessage } from '../errors/ErrorMessage';
import vCard from 'vcf';

export const parseVCard = (vCardContent: string): ContactVCard => {
	let parsedVCard;
	try {
		parsedVCard = new vCard().parse(vCardContent);
	} catch (ex) {
		if (ex instanceof SyntaxError) {
			if (ex.message.includes('Expected "BEGIN:VCARD"')) {
				throw new Error(ErrorMessage.CONTACTS_VCARD_MISSING_BEGIN);
			}
			if (ex.message.includes('Expected "END:VCARD"')) {
				throw new Error(ErrorMessage.CONTACTS_VCARD_MISSING_END);
			}
		}
		throw new Error(ex);
	}

	if (parsedVCard.version !== '4.0') {
		throw new Error(ErrorMessage.CONTACTS_INVALID_VCARD_VERSION);
	}

	const nameAttribute = parsedVCard.get('n');
	const phoneAttribute = parsedVCard.get('tel');
	const emailAttribute = parsedVCard.get('email');
	const addressAttribute = parsedVCard.get('adr');
	const organizationAttribute = parsedVCard.get('org');

	if (nameAttribute === undefined) {
		throw new Error(ErrorMessage.CONTACTS_MISSING_NAME_ATTRIBUTE);
	}

	if (phoneAttribute === undefined) {
		throw new Error(ErrorMessage.CONTACTS_MISSING_TEL_ATTRIBUTE);
	}

	const names = nameAttribute
		.toString()
		.replace(/(.*)N(.*):/, '')
		.split(';');

	validateAmountOfNames(names);

	const [lastname, firstname] = names;

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

export const createVCards = (contacts: ContactImport[]): string[] => {
	const cards: string[] = [];
	contacts.map(contact => {
		const card = new vCard();
		card.add('n', `${contact.firstname};${contact.lastname}`);
		contact.organizations.forEach(organization => {
			card.add('org', organization.join(';'));
		});
		contact.phoneNumbers.forEach(phoneNumber => {
			card.add('tel', phoneNumber.phone, {
				type: phoneNumber.type,
			});
		});
		if (contact.emails !== undefined) {
			contact.emails.forEach(mail => {
				card.add('email', mail.email, {
					type: mail.type,
				});
			});
		}
		if (contact.addresses !== undefined) {
			const { addresses } = contact;
			addresses.forEach(address => {
				card.add(
					'addr',
					`${address.poBox};${address.extendedAddress};${address.streetAddress};${address.locality};${address.region};${address.postalCode};${address.country}`,
					{
						type: address.type,
					}
				);
			});
		}
		cards.push(card.toString('4.0'));
	});
	return cards;
};

const validateAtLeastRequiredAddressLength = (
	addressValues: string[] | undefined
): void => {
	if (addressValues && addressValues.length < 7)
		throw new Error(ErrorMessage.CONTACTS_INVALID_AMOUNT_OF_ADDRESS_VALUES);
};

const validateAmountOfAddresses = (
	addressAttribute: vCard.Property | vCard.Property[]
): void => {
	if (addressAttribute && typeof addressAttribute.valueOf() === 'object')
		throw new Error(ErrorMessage.CONTACTS_INVALID_AMOUNT_OF_ADDRESSES);
};

const validateAmountOfEmails = (
	emailAttribute: vCard.Property | vCard.Property[]
): void => {
	if (emailAttribute && typeof emailAttribute.valueOf() === 'object')
		throw new Error(ErrorMessage.CONTACTS_INVALID_AMOUNT_OF_EMAILS);
};

const validateAmountOfPhoneNumbers = (
	phoneAttribute: vCard.Property | vCard.Property[]
): void => {
	if (typeof phoneAttribute.valueOf() === 'object')
		throw new Error(ErrorMessage.CONTACTS_INVALID_AMOUNT_OF_PHONE_NUMBERS);
};

const validateAmountOfNames = (names: string[]): void => {
	if (names.length < 2)
		throw new Error(ErrorMessage.CONTACTS_INVALID_AMOUNT_OF_NAMES);
};
