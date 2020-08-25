import {
	AuthCredentials,
	HttpRequestConfig,
	SipgateIOClient,
} from './sipgateIOClient.types';

import { detect as detectPlatform } from 'detect-browser';
import {
	validateEmail,
	validateOAuthToken,
	validatePassword,
} from '../validator';
import { version } from '../../version.json';
import axios from 'axios';
import btoa from 'btoa';

import qs from 'qs';

export const sipgateIO = (credentials: AuthCredentials): SipgateIOClient => {
	const authorizationHeader = getAuthHeader(credentials);

	const platformInfo = detectPlatform();
	const client = axios.create({
		baseURL: 'https://api.sipgate.com/v2',
		headers: {
			Authorization: authorizationHeader,
			'X-Sipgate-Client': JSON.stringify(platformInfo),
			'X-Sipgate-Version': version,
			'Content-Type': 'application/json',
		},
		paramsSerializer: (params) =>
			qs.stringify(params, { arrayFormat: 'repeat' }),
	});

	return {
		delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
			return client.delete<T>(url, config).then((response) => response.data);
		},

		get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
			return client.get<T>(url, config).then((response) => response.data);
		},

		patch<T>(
			url: string,
			data?: unknown,
			config?: HttpRequestConfig
		): Promise<T> {
			return client
				.patch<T>(url, data, config)
				.then((response) => response.data);
		},

		post<T>(
			url: string,
			data?: unknown,
			config?: HttpRequestConfig
		): Promise<T> {
			return client
				.post<T>(url, data, config)
				.then((response) => response.data);
		},

		put<T>(
			url: string,
			data?: unknown,
			config?: HttpRequestConfig
		): Promise<T> {
			return client.put<T>(url, data, config).then((response) => response.data);
		},
	};
};

const getAuthHeader = (credentials: AuthCredentials): string => {
	if ('token' in credentials) {
		const tokenValidationResult = validateOAuthToken(credentials.token);

		if (!tokenValidationResult.isValid) {
			throw new Error(tokenValidationResult.cause);
		}
		return `Bearer ${credentials.token}`;
	}

	const emailValidationResult = validateEmail(credentials.username);

	if (!emailValidationResult.isValid) {
		throw new Error(emailValidationResult.cause);
	}

	const passwordValidationResult = validatePassword(credentials.password);

	if (!passwordValidationResult.isValid) {
		throw new Error(passwordValidationResult.cause);
	}

	return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
};
