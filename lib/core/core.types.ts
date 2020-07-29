export interface Pagination {
	offset?: number;
	limit?: number;
}

export interface UserInfo {
	sub: string;
	domain: string;
	masterSipId: string;
	locale: string;
}
