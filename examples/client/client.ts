import { sipgateIO } from '../../lib/core/sipgateIOClient';

/**
 * Option 1: Creating the Client with Basic Auth credentials (not recommended)
 *
 * Reference: https://developer.sipgate.io/rest-api/authentication/#basic-auth
 */
const basicAuthClient = sipgateIO({
	username: 'email@domain.com',
	password: 'your-account-password',
});

console.log(basicAuthClient);

/**
 * Option 2: Creating the Client with an OAuth Access Token (recommended)
 *
 * reference: https://developer.sipgate.io/rest-api/authentication/#oauth2
 */
const oauthClient = sipgateIO({
	token: 'YOUR_OAUTH_ACCESS_TOKEN',
});

console.log(oauthClient);
