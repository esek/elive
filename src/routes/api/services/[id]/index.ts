import prisma from '$/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Get the service information for a specific service
 */
export const get: RequestHandler = async ({ params }) => {
	const { id } = params;

	const service = await prisma.service.findFirst({
		where: {
			id: Number(id)
		}
	});

	return {
		body: service
	};
};

/**
 * Updates a specific service
 */
export const put: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	const body: Prisma.ServiceUpdateInput = await request.json();

	const service = await prisma.service.update({
		where: {
			id: Number(id)
		},
		data: body
	});

	return {
		body: service
	};
};

/**
 * Deletes a specific service
 */
export const del: RequestHandler = async ({ params }) => {
	const { id } = params;

	const service = await prisma.service.delete({
		where: {
			id: Number(id)
		}
	});

	return {
		body: service
	};
};
