import { parseAndCheckCSV } from './contacts';

describe('Call Module', () => {
	it('should parse the csv successfully', async () => {
		const EXAMPLE_STRING = `gender,lastname,firstname,number
m,turing,theodor,number`;
		const EXPECTED_STRING = `firstname,lastname,number
theodor,turing,number`;

		expect(parseAndCheckCSV(EXAMPLE_STRING)).toBe(EXPECTED_STRING);
	});
});
