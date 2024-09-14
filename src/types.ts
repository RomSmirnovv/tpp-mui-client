export type ErrorWithMessage = {
	status: number;
	data: {
		error: string;
		message?: string
	}
}