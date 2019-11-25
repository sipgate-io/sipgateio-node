import { ErrorMessage } from '../errors';
import { validateOAuthToken } from './validateOAuthToken';

describe('ValidateOAuthToken', () => {
	const validOAuthToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmM2U3ZzI0NC0yNDQ3LTQ1ODctOWZjYy05ZWY1MjQ3aDE3NHMiLCJleHAiOjE1NDY2NTQ4MjcsIm5iZiI6MCwiaWF0IjoxNTY1NDgzMjE4LCJpc3MiOiJodHRwczovL2xvZ2luLnNpcGdhdGUuY29tL2F1dGgvcmVhbG1zL3RoaXJkLXBhcnR5Iiwic3ViIjoiZjoyZTc0ODY1Ny1mNTV6LTg5Z3MtOWdmMi1ydDU4MjRoMjQ1MTg6ODQ1Mjg0NiIsInR5cCI6IkJlYXJlciIsImF6cCI6InNpcGdhdGUtc3dhZ2dlci11aSIsIm5vbmNlIjoiOTgyMTU3MSIsImF1dGhfdGltZSI6MTU2NTQyODU0OCwic2Vzc2lvbl9zdGF0ZSI6Ijg1ZzR6MXM3LTc4ZzItNDM4NS05ZTFnLXIxODdmMjc0ZWQ5ayIsImFjciI6IjAiLCJzY29wZSI6ImFsbCJ9.axEQX90FLk4W89y92C9eQnwMV3wfewk5zaPCszj46YA';

	test.each`
		input                                         | expected
		${validOAuthToken}                            | ${{ isValid: true }}
		${`header.invalidPayload.${validOAuthToken}`} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_OAUTH_TOKEN }}
		${''}                                         | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_OAUTH_TOKEN }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validateOAuthToken(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
