interface BaseCallData {
	deviceId?: string;
	callerId?: string;
}

interface BaseCallee {
	to: string;
}

/**
 * @deprecated
 * @since 1.0.1
 * use @interface BaseCallee instead
 */
interface DeprecatedCallee {
	callee: string;
}

type Callee = BaseCallee | DeprecatedCallee;

interface BaseCaller {
	from: string;
}

/**
 * @deprecated
 * @since 1.0.1
 * use @interface BaseCaller instead
 */
interface DeprecatedCaller {
	caller: string;
}
type Caller = BaseCaller | DeprecatedCaller;

export type CallData = BaseCallData & Callee & Caller;

export interface InitiateNewCallSessionResponse {
	sessionId: string;
}

export interface CallModule {
	initiate: (
		newCallRequest: CallData
	) => Promise<InitiateNewCallSessionResponse>;
}

export interface CallDTO {
	caller: string;
	callee: string;
	callerId?: string;
	deviceId?: string;
}
