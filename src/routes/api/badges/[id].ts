import prisma, { fetchService } from '$/lib/prisma';
import StatusFetcher from '$/lib/StatusFetcher';
import type { RequestHandler } from '@sveltejs/kit';
import { makeBadge } from 'badge-maker';
import type { Params } from '../services/[id]';

/**
 * Uses shields.io badge-maker to create a badge for a given status.
 */
export const get: RequestHandler<Params, string> = async ({ params }) => {
	const { id } = params;

	const service = await fetchService(Number(id), true);

	if (!service) {
		return {
			status: 404,
			body: 'Badge not found'
		};
	}

	const fetcher = new StatusFetcher(service, true);

	await fetcher.fetch();

	const json = fetcher.toJson();

	const badge = makeBadge({
		label: service.button?.label ?? service.name,
		message: json.status.message,
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
