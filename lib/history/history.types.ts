import { Pagination } from '../core';

export interface HistoryModule {
	fetchAll: (
		filter?: HistoryFilter,
		pagination?: Pagination
	) => Promise<HistoryEntry[]>;
	fetchById: (entryId: string) => Promise<HistoryEntry>;
	deleteByListOfIds: (entryIds: string[]) => Promise<void>;
	deleteById: (entryId: string) => Promise<void>;
	batchUpdateEvents: (
		events: HistoryEntry[],
		callback: (entry: HistoryEntry) => HistoryEntryUpdateOptions
	) => Promise<void>;
	exportAsCsvString: (
		filter?: BaseHistoryFilter,
		pagination?: Pagination
	) => Promise<string>;
}

export interface HistoryEntryUpdateOptions {
	archived?: boolean;
	starred?: boolean;
	note?: string;
	read?: boolean;
}

export interface HistoryEntryUpdateOptionsWithId
	extends HistoryEntryUpdateOptions {
	id: string;
}

export interface BaseHistoryFilter {
	connectionIds?: string[];
	types?: HistoryEntryType[];
	directions?: Direction[];
	archived?: boolean;
	starred?: Starred;
	from?: Date;
	to?: Date;
}

export interface HistoryFilter extends BaseHistoryFilter {
	phonenumber?: string;
}

export enum HistoryEntryType {
	CALL = 'CALL',
	VOICEMAIL = 'VOICEMAIL',
	SMS = 'SMS',
	FAX = 'FAX',
}

export enum Direction {
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING',
	MISSED_INCOMING = 'MISSED_INCOMING',
	MISSED_OUTGOING = 'MISSED_OUTGOING',
}

export enum Starred {
	STARRED = 'STARRED',
	UNSTARRED = 'UNSTARRED',
}

export interface BaseHistoryEntry {
	id: string;
	source: string;
	target: string;
	sourceAlias: string;
	targetAlias: string;
	type: HistoryEntryType;
	created: Date;
	lastModified: Date;
	direction: Direction;
	incoming: boolean;
	status: string;
	connectionIds: string[];
	read: boolean;
	archived: boolean;
	note: string;
	endpoints: RoutedEndpoint[];
	starred: boolean;
	labels: string[];
}

export interface Endpoint {
	extension: string;
	type: string;
}

export interface RoutedEndpoint {
	type: string;
	endpoint: Endpoint;
}

export interface FaxHistoryEntry extends BaseHistoryEntry {
	type: HistoryEntryType.FAX;
	faxStatus: FaxStatusType;
	scheduled: string;
	documentUrl: string;
	reportUrl: string;
	previewUrl: string;
	pageCount: number;
}

export enum FaxStatusType {
	PENDING = 'PENDING',
	SENDING = 'SENDING',
	FAILED = 'FAILED',
	SENT = 'SENT',
	SCHEDULED = 'SCHEDULED',
}

export interface CallHistoryEntry extends BaseHistoryEntry {
	type: HistoryEntryType.CALL;
	callId: string;
	recordings: Recording[];
	duration: number;
	callStatus: CallStatusType;
}

export interface Recording {
	id: string;
	url: string;
}

export enum CallStatusType {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	REJECTED = 'REJECTED',
	REJECTED_DND = 'REJECTED_DND',
	VOICEMAIL_NO_MESSAGE = 'VOICEMAIL_NO_MESSAGE',
	BUSY_ON_BUSY = 'BUSY_ON_BUSY',
	BUSY = 'BUSY',
	MISSED = 'MISSED',
}

export interface SmsHistoryEntry extends BaseHistoryEntry {
	type: HistoryEntryType.SMS;
	smsContent: string;
	scheduled: string;
}

export interface VoicemailHistoryEntry extends BaseHistoryEntry {
	type: HistoryEntryType.VOICEMAIL;
	transcription: string;
	recordingUrl: string;
	duration: number;
}

export type HistoryEntry =
	| CallHistoryEntry
	| FaxHistoryEntry
	| SmsHistoryEntry
	| VoicemailHistoryEntry;

export interface HistoryResponse {
	items: HistoryEntry[];
	totalCount: number;
}
