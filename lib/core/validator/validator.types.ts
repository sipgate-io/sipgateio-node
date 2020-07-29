export type ValidationResult =
	| { isValid: true }
	| { isValid: false; cause: string };
