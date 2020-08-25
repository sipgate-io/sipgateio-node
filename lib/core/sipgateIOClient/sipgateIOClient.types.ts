import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface BasicAuthCredentials {
	username: string;
	password: string;
}

export interface OAuthCredentials {
	token: string;
}

export type AuthCredentials = BasicAuthCredentials | OAuthCredentials;

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
}
