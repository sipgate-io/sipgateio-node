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
	get: <T = any, R = HttpResponse<T>>(
		url: string,
		config?: HttpRequestConfig
	) => Promise<R>;
	post: <T = any, R = HttpResponse<T>>(
		url: string,
		data?: any,
		config?: HttpRequestConfig
	) => Promise<R>;
	put: <T = any, R = HttpResponse<T>>(
		url: string,
		data?: any,
		config?: HttpRequestConfig
	) => Promise<R>;
	delete: <T = any, R = HttpResponse<T>>(
		url: string,
		config?: HttpRequestConfig
	) => Promise<R>;
	patch: <T = any, R = HttpResponse<T>>(
		url: string,
		data?: any,
		config?: HttpRequestConfig
	) => Promise<R>;
}
