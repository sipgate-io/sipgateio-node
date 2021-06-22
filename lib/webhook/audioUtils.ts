import { IAudioMetadata, IFormat, parseStream } from 'music-metadata';
import axios from 'axios';

export interface ValidateOptions {
	container?: string;
	codec?: string;
	bitsPerSample?: number;
	sampleRate?: number;
	numberOfChannels?: number;
}

export interface ValidateResult {
	isValid: boolean;
	metadata: IAudioMetadata;
}

export const getAudioMetadata = async (
	url: string
): Promise<IAudioMetadata> => {
	const response = await axios({
		method: 'get',
		url: url,
		responseType: 'stream',
	});
	return await parseStream(response.data);
};

export const validateAudio = (
	metadata: IAudioMetadata,
	validateOptions: ValidateOptions
): boolean => {
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
