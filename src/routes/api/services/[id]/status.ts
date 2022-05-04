import StatusFetcher from '$/lib/StatusFetcher';
import prisma from '$lib/prisma';
import type { ServiceWithStatus } from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Get the status for a specific service
 */
export const get: RequestHandler = async ({ url, params }) => {
	// you can opt out of using parsers by appending ?parsers=false to the url
	const useParsers = url.searchParams.get('parsers') !== 'false';

	const { id } = params;

	const service = await prisma.service.findFirst({
		where: {
			id: Number(id)
		},
		include: {
			status: {
				include: {
					headers: true
				}
			}
		}
	});

	if (!service?.status) {
		return {
			status: 404,
			body: 'Service not found'
		};
	}

	const status = await new StatusFetcher(service as ServiceWithStatus, useParsers).fetch();

	return {
		body: status.toJson(),
		headers: {
			'Content-Type': 'application/json'
		}
	};
};
