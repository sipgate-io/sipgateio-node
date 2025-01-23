import { Buffer } from 'buffer';

export const toBase64 = (input: string): string => {
	if (typeof btoa !== 'undefined') {
		return btoa(input);
	} else {
		return Buffer.from(input, 'binary').toString('base64');
	}
};

export const fromBase64 = (input: string): string => {
	return Buffer.from(input, 'base64').toString('binary');
};
