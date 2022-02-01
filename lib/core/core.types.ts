export interface Pagination {
	offset?: number;
	limit?: number;
}

export interface PagedResponse<T> {
	response: T,
	hasMore: boolean
}

export interface UserInfo {
	sub: string;
	domain: string;
	masterSipId: string;
	locale: string;
}
