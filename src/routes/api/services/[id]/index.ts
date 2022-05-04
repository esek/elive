import prisma from '$/lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';

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
