import prisma from '$/lib/prisma';
import StatusFetcher from '$/lib/StatusFetcher';
import type { ServiceResponse } from '$/models/ServiceResponse';
import type { RequestHandler } from '@sveltejs/kit';
import { makeBadge } from 'badge-maker';

/**
 * Uses shields.io badge-maker to create a badge for a given status.
 */
export const get: RequestHandler = async ({ params }) => {
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

	if (!service) {
		return {
			status: 404,
			body: 'Badge not found'
		};
	}

	const status = await new StatusFetcher(service as ServiceResponse, true).fetch();
	const json = status.toJson();

	const badge = makeBadge({
		label: json.label,
		message: json.status.data,
		color: json.status.color,
		style: 'plastic'
	});

	return {
		body: badge,
		headers: {
			'Content-Type': 'image/svg+xml'
		}
	};
};
