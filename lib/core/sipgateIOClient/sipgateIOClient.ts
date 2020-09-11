import {
	AuthCredentials,
	HttpRequestConfig,
	SipgateIOClient,
} from './sipgateIOClient.types';

import { detect as detectPlatform } from 'detect-browser';
import { toBase64 } from '../../utils';
import {
	validateEmail,
	validateOAuthToken,
	validatePassword,
} from '../validator';
import { version } from '../../version.json';
import axios from 'axios';
import qs from 'qs';

interface RawDeserialized {
	[key: string]: RawDeserializedValue;
}

type RawDeserializedValue = RawDeserialized | string | number | boolean;

interface DeserializedWithDate {
	[key: string]: DeserializedWithDateValue;
}

type DeserializedWithDateValue =
	| string
	| number
	| boolean
	| Date
	| DeserializedWithDate;

const parseRawDeserializedValue = (
	value: RawDeserializedValue
): DeserializedWithDateValue => {
	return typeof value === 'object'
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

	return `Basic ${toBase64(`${credentials.username}:${credentials.password}`)}`;
};
