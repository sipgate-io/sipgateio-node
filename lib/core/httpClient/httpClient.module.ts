/* eslint  @typescript-eslint/no-explicit-any: 0 */
import { AxiosError, AxiosRequestConfig } from 'axios';

export type HttpRequestConfig = AxiosRequestConfig;

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
