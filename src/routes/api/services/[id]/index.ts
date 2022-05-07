import prisma, { fetchService } from '$/lib/prisma';
import type { Prisma, Service } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

export type Params = {
	id: string;
};

/**
 * Get the service information for a specific service
 */
export const get: RequestHandler<Params, Service> = async ({ params }) => {
	const { id } = params;

	const service = await fetchService(Number(id), false);

	return {
		body: service
	};
};

/**
 * Updates a specific service
 */
export const put: RequestHandler<Params, Service> = async ({ params, request }) => {
	const { id } = params;
	const body: Prisma.ServiceUpdateInput = await request.json();

	const service = await prisma.service.update({
		where: {
			id: Number(id)
		},
		include: {
			button: true,
			headers: true
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
		},
		include: {
			button: true,
			headers: true
		}
	});

	return {
		body: service
	};
};
