import type { Prisma, Service, ServiceStatus, StatusHeader } from '@prisma/client';

export type ServiceResponse = Service & {
	status: ServiceStatus & {
		headers: StatusHeader[];
	};
};
