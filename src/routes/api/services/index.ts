import prisma, { fetchServices } from '$/lib/prisma';
import type { FullService } from '$/models/ServiceResponse';
import type { Prisma, Service } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Get the service information for all services
 */
export const get: RequestHandler<{}, Service[]> = async () => {
	const services = await fetchServices(false);

	return {
		body: services
	};
};

/**
 * Creates a new service
 */
export const post: RequestHandler<{}, Service> = async ({ request }) => {
	const body: FullService = await request.json();

	const { headers, button, ...reduced } = body;

	const service = await prisma.service.create({
		data: {
			...reduced
		}
	});

	return {
		status: 201,
		body: service,
		headers: {
			'Content-Type': 'application/json',
			Location: `/api/services/${service.id}`
		}
	};
};
