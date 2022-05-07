import StatusFetcher from '$/lib/StatusFetcher';
import prisma, { fetchService } from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import type { Params } from '.';
import type { ServiceWithStatus } from '$/models/ServiceResponse';

/**
 * Get the status for a specific service
 */
export const get: RequestHandler<Params, ServiceWithStatus> = async ({ url, params }) => {
	// you can opt out of using parsers by appending ?parsers=false to the url
	const useParsers = url.searchParams.get('parsers') !== 'false';

	const { id } = params;

	const service = await fetchService(Number(id), true);

	const fetcher = new StatusFetcher(service, useParsers);

	await fetcher.fetch();

	return {
		body: fetcher.toJson(),
		headers: {
			'Content-Type': 'application/json'
		}
	};
};
