import { IAudioMetadata, parseStream } from 'music-metadata';
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
): Promise<ValidateOptions> => {
	const response = await axios({
		method: 'get',
		url: url,
		responseType: 'stream',
	});
	const metadata = await parseStream(response.data);
	return metadata.format as ValidateOptions;
};

export const validateAudio = (
	metadata: ValidateOptions,
	validateOptions: ValidateOptions
): boolean => {
	for (const key in validateOptions) {
		if (
			validateOptions[key as keyof ValidateOptions] !==
			metadata[key as keyof ValidateOptions]
		) {
			return false;
		}
	}
	return true;
};
