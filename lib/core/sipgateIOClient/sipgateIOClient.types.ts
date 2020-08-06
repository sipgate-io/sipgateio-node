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
export type HttpResponse<T = any> = AxiosResponse<T>;

export type HttpError<T = any> = AxiosError<T>;

export interface HttpClientModule {
	get: <T = any>(url: string, config?: HttpRequestConfig) => Promise<T>;
	post: <T = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig
	) => Promise<T>;
	put: <T = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig
	) => Promise<T>;
	delete: <T = any>(url: string, config?: HttpRequestConfig) => Promise<T>;
	patch: <T = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig
	) => Promise<T>;
}
