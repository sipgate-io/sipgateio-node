import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 *	@deprecated
 *	@since 2.2.0
 */
export interface BasicAuthCredentials {
	username: string;
	password: string;
}

export interface OAuthCredentials {
	token: string;
}

export interface PersonalAccessTokenCredentials {
	tokenId: string;
	token: string;
}

export interface Webuser {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	defaultDevice: string;
	busyOnBusy: string;
	addressId: string;
	directDialIds: string[];
	timezone: string;
	admin: string;
}

export type AuthCredentials =
	| BasicAuthCredentials
	| OAuthCredentials
	| PersonalAccessTokenCredentials;

export type HttpRequestConfig = AxiosRequestConfig;
export type HttpResponse<T> = AxiosResponse<T>;

export type HttpError<T> = AxiosError<T>;

export interface SipgateIOClient {
	get: <T>(url: string, config?: HttpRequestConfig) => Promise<T>;
	post: <T>(
		url: string,
		data?: unknown,
		config?: HttpRequestConfig
	) => Promise<T>;
	put: <T>(
		url: string,
		data?: unknown,
		config?: HttpRequestConfig
	) => Promise<T>;
	delete: <T>(url: string, config?: HttpRequestConfig) => Promise<T>;
	patch: <T>(
		url: string,
		data?: unknown,
		config?: HttpRequestConfig
	) => Promise<T>;
	getAuthenticatedWebuserId: () => Promise<string>;
	getWebUsers: () => Promise<Webuser[]>;
}
