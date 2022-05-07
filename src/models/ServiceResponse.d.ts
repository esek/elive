import type { Service, ServiceButtonOptions, RequestHeader } from '@prisma/client';

export type FullService = Service & {
	button: ServiceButtonOptions | null;
	headers: RequestHeader[];
};

export type StrippedService<T extends keyof typeof Service = ''> = Omit<
	FullService,
	T | 'headers' | 'button'
>;

export type ServiceWithStatus = {
	service: StrippedService;
	status: {
		label: string;
		success: boolean;
		message: string;
		color: string;
	};
};
