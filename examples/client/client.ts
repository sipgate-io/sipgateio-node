import { sipgateIO } from '../../lib/core/sipgateIOClient';

/**
 * Connecting the Client by using Basic Authentication
 *
 * If you want to connect the sipgate.io Client by using Basic Auth, you have to
 * pass the Client, your Credentials.
 * (username and password)
 *
 * remember: This is not recommended!
 * reference: https://developer.sipgate.io/rest-api/authentication/#basic-auth
 */
const basicAuthClient = sipgateIO({
	username: 'email@domain.com',
	password: 'your-account-password',
});

console.log(basicAuthClient);

/**
 * Connecting the Client by using an OAuth Token
 *
 * Instead you should connect the sipgate.io Client using OAuth.
 * Now you have to pass the Library a working non expired Authentication Token.
 * You have to refresh the token yourself.
 *
 * reference: https://developer.sipgate.io/rest-api/authentication/#oauth2
 */
const oauthClient = sipgateIO({
	token: 'YOUR_OAUTH_TOKEN',
});

console.log(oauthClient);
