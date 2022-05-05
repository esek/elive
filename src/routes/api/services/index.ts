import prisma from '$/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Get the service information for all services
 */
export const get: RequestHandler = async () => {
	const services = await prisma.service.findMany({
		include: {
			status: {
				include: {
					headers: true
				}
			}
		}
	});

	return {
		body: services
	};
};

/**
 * Creates a new service
 */
export const post: RequestHandler = async ({ request }) => {
	const body: Prisma.ServiceCreateInput = await request.json();

	if (!body.status) {
		return {
			status: 400,
			body: 'Status is required'
		};
	}

	const service = await prisma.service.create({
		data: body,
		include: {
			status: {
				include: {
					headers: true
				}
			}
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
