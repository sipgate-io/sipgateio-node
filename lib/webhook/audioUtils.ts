import { IFormat, parseStream } from 'music-metadata';
import axios from 'axios';

export interface ValidateOptions {
	container?: string;
	codec?: string;
	bitsPerSample?: number;
	sampleRate?: number;
	numberOfChannels?: number;
}

export const validateAudio = async (
	url: string,
	validateOptions: ValidateOptions
): Promise<boolean> => {
	const response = await axios({
		method: 'get',
		url: url,
		responseType: 'stream',
	});
	const metadata = await parseStream(response.data);
	for (const key in validateOptions) {
		if (
			validateOptions[key as keyof ValidateOptions] !==
			metadata.format[key as keyof IFormat]
		) {
			return false;
		}
	}
	return true;
};
