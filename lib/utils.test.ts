import { fromBase64, toBase64 } from './utils';

describe('utility functions', () => {
	it('should round-trip correctly', () => {
		const input = 'this is ä test';
		expect(fromBase64(toBase64(input))).toBe(input);
	});

	it('should correctly convert from string to base64', () => {
		const input = 'an example sentence';
		const expected = 'YW4gZXhhbXBsZSBzZW50ZW5jZQ==';
		expect(toBase64(input)).toBe(expected);
	});

	it('should correctly convert from base64 to string', () => {
		const input = 'YW4gZXhhbXBsZSBzZW50ZW5jZQ==';
		const expected = 'an example sentence';
		expect(fromBase64(input)).toBe(expected);
	});
});
