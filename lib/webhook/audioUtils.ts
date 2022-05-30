import { parseStream } from 'music-metadata';
import axios from 'axios';

export interface ValidateOptions {
	container?: string;
	codec?: string;
	bitsPerSample?: number;
	sampleRate?: number;
	numberOfChannels?: number;
	duration?: number;
}

interface ValidateResult {
	isValid: boolean;
	metadata: ValidateOptions;
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

const validateAudio = (
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

export const validateAnnouncementAudio = async (
	urlToAnnouncement: string
): Promise<ValidateResult> => {
	const validateOptions = {
		container: 'WAVE',
		codec: 'PCM',
		bitsPerSample: 16,
		sampleRate: 8000,
		numberOfChannels: 1,
	};

	const metadata = await getAudioMetadata(urlToAnnouncement);

	return {
		isValid: validateAudio(metadata, validateOptions),
		metadata,
	};
};
