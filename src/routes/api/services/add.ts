import prisma from '$/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
	const body: Prisma.ServiceCreateInput = await request.json();

	const service = await prisma.service.create({
		data: body
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
