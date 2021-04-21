import {
	AuthCredentials,
	HttpRequestConfig,
	SipgateIOClient,
} from './sipgateIOClient.types';

import { UserInfo } from '../core.types';
import { detect as detectPlatform } from 'detect-browser';
import { handleCoreError } from '../errors';
import { toBase64 } from '../../utils';
import {
	validateEmail,
	validateOAuthToken,
	validatePassword,
	validateTokenID,
} from '../validator';
import { version } from '../../version.json';
import axios from 'axios';
import qs from 'qs';
import { validatePersonalAccessToken } from '../validator/validatePersonalAccessToken';

interface RawDeserialized {
	[key: string]: RawDeserializedValue;
}

type RawDeserializedValue =
	| null
	| string
	| number
	| boolean
	| RawDeserialized
	| RawDeserializedValue[];

interface DeserializedWithDate {
	[key: string]: DeserializedWithDateValue;
}

type DeserializedWithDateValue =
	| null
	| string
	| number
	| boolean
	| Date
	| DeserializedWithDate
	| DeserializedWithDateValue[];

const parseRawDeserializedValue = (
	value: RawDeserializedValue
): DeserializedWithDateValue => {
	return value === null
		? null
		: value instanceof Array
		? value.map(parseRawDeserializedValue)
		: typeof value === 'object'
		? parseDatesInObject(value)
		: typeof value === 'string'
		? parseIfDate(value)
		: value;
};

const parseDatesInObject = (data: RawDeserialized): DeserializedWithDate => {
	const newData: DeserializedWithDate = {};
	Object.keys(data).forEach((key) => {
		const value = data[key];
		newData[key] = parseRawDeserializedValue(value);
	});
	return newData;
};

const parseIfDate = (maybeDate: string): Date | string => {
	const regexISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)(?:Z|([+-])([\d|:]*))?$/;
	if (maybeDate.match(regexISO)) {
		return new Date(maybeDate);
	}
	return maybeDate;
};

export const sipgateIO = (credentials: AuthCredentials): SipgateIOClient => {
	const authorizationHeader = getAuthHeader(credentials);

	const platformInfo = detectPlatform();
	const client = axios.create({
		baseURL: 'https://api.sipgate.com/v2',
		headers: {
			Authorization: authorizationHeader,
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-Sipgate-Client': JSON.stringify(platformInfo),
			'X-Sipgate-Version': version,
		},
		paramsSerializer: (params) =>
			qs.stringify(params, { arrayFormat: 'repeat' }),
	});

	client.interceptors.response.use((response) => {
		response.data = parseRawDeserializedValue(response.data);
		return response;
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
		getAuthenticatedWebuserId(): Promise<string> {
			return client
				.get<UserInfo>('authorization/userinfo')
				.then((response) => response.data.sub)
				.catch((error) => Promise.reject(handleCoreError(error)));
		},
	};
};

const getAuthHeader = (credentials: AuthCredentials): string => {
	if ('tokenId' in credentials) {
		
		const tokenIDValidationResult = validateTokenID(credentials.tokenId);
		if (!tokenIDValidationResult.isValid) {
			throw new Error(
				tokenIDValidationResult.cause
			);
		}
	
		const tokenValidationResult = validatePersonalAccessToken(credentials.token);
	
		if (!tokenValidationResult.isValid) {
			throw new Error(tokenValidationResult.cause);
		}
	
		return `Basic ${toBase64(`${credentials.tokenId}:${credentials.token}`)}`;
	}

	if ('token' in credentials) {
		const tokenValidationResult = validateOAuthToken(credentials.token);

		if (!tokenValidationResult.isValid) {
			throw new Error(tokenValidationResult.cause);
		}
		return `Bearer ${credentials.token}`;
	}

	const emailValidationResult = validateEmail(credentials.username);

	if (!emailValidationResult.isValid) {
		throw new Error(
			emailValidationResult.cause
		);
	}

	const passwordValidationResult = validatePassword(credentials.password);

	if (!passwordValidationResult.isValid) {
		throw new Error(passwordValidationResult.cause);
	}

	return `Basic ${toBase64(`${credentials.username}:${credentials.password}`)}`;
};
