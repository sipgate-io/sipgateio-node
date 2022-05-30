import { ContactImport, ContactVCard } from './Address';
import { ContactsErrorMessage } from '../errors/handleContactsError';
import vCard from 'vcf';

export const parseVCard = (vCardContent: string): ContactVCard => {
	let parsedVCard;
	try {
		parsedVCard = new vCard().parse(vCardContent);
	} catch (ex) {
		if (ex instanceof SyntaxError) {
			if (ex.message.includes('Expected "BEGIN:VCARD"')) {
				throw new Error(ContactsErrorMessage.CONTACTS_VCARD_MISSING_BEGIN);
			}
			if (ex.message.includes('Expected "END:VCARD"')) {
				throw new Error(ContactsErrorMessage.CONTACTS_VCARD_MISSING_END);
			}
		}
		throw new Error(ContactsErrorMessage.CONTACTS_VCARD_FAILED_TO_PARSE);
	}

	if (parsedVCard.version !== '4.0') {
		throw new Error(ContactsErrorMessage.CONTACTS_INVALID_VCARD_VERSION);
	}

	const nameAttribute = parsedVCard.get('n');
	const phoneAttribute = parsedVCard.get('tel');
	const emailAttribute = parsedVCard.get('email');
	const addressAttribute = parsedVCard.get('adr');
	const organizationAttribute = parsedVCard.get('org');

	if (nameAttribute === undefined) {
		throw new Error(ContactsErrorMessage.CONTACTS_MISSING_NAME_ATTRIBUTE);
	}

	if (phoneAttribute === undefined) {
		throw new Error(ContactsErrorMessage.CONTACTS_MISSING_TEL_ATTRIBUTE);
	}

	const names = nameAttribute
		.toString()
		.replace(/(.*)N(.*):/, '')
		.split(';');

	if (isAmountOfNamesInvalid(names)) {
		throw new Error(ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_NAMES);
	}

	const [lastname, firstname] = names;

	if (isMultipleOf(phoneAttribute)) {
		throw new Error(
			ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_PHONE_NUMBERS
		);
	}

	if (isMultipleOf(addressAttribute)) {
		throw new Error(ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_ADDRESSES);
	}

	let addressValues;
	if (addressAttribute) {
		addressValues = addressAttribute
			.toString()
			.replace(/(.*)ADR(.*):/, '')
			.split(';');
	}

	if (addressValues && isAddressAttributeAmountInvalid(addressValues)) {
		throw new Error(
			ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_ADDRESS_VALUES
		);
	}
	if (isMultipleOf(emailAttribute)) {
		throw new Error(ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_EMAILS);
	}

	const organization =
		organizationAttribute instanceof Array
			? organizationAttribute
			: [organizationAttribute];

	let result: ContactVCard = {
		firstname,
		lastname,
		phoneNumber: phoneAttribute.valueOf().toString(),
		email: emailAttribute ? emailAttribute.valueOf().toString() : undefined,
		organization: organization.map((x) =>
			x
				.toString()
				.replace(/(.*)ORG(.*):/, '')
				.split(';')
		),
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
	contacts.map((contact) => {
		const card = new vCard();
		card.add('n', `${contact.firstname};${contact.lastname}`);
		contact.organizations.forEach((organization) => {
			card.add('org', organization.join(';'));
		});
		contact.phoneNumbers.forEach((phoneNumber) => {
			card.add('tel', phoneNumber.number, {
				type: phoneNumber.type,
			});
		});
		if (contact.emails !== undefined) {
			contact.emails.forEach((mail) => {
				card.add('email', mail.email, {
					type: mail.type,
				});
			});
		}
		if (contact.addresses !== undefined) {
			const { addresses } = contact;
			addresses.forEach((address) => {
				card.add(
					'addr',
					`${address.poBox ? address.poBox : ''};${address.extendedAddress ? address.extendedAddress : ''
					};${address.streetAddress ? address.streetAddress : ''};${address.locality ? address.locality : ''
					};${address.region ? address.region : ''};${address.postalCode ? address.postalCode : ''
					};${address.country ? address.country : ''}`,
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

const isAddressAttributeAmountInvalid = (addressValues: string[]): boolean => {
	return addressValues.length < 7;
};

const isMultipleOf = (
	vCardProperty: vCard.Property | vCard.Property[]
): boolean => {
	return vCardProperty && typeof vCardProperty.valueOf() === 'object';
};
const isAmountOfNamesInvalid = (names: string[]): boolean => {
	return names.length < 2;
};
