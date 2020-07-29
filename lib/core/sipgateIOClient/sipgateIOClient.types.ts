export interface BasicAuthCredentials {
	username: string;
	password: string;
}

export interface OAuthCredentials {
	token: string;
}

export type AuthCredentials = BasicAuthCredentials | OAuthCredentials;
