import StatusFetcher from '$/lib/StatusFetcher';
import type { FullService, ServiceWithStatus } from '$/models/ServiceResponse';
import { fetchServices } from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetches the status of all services
 * and returns them as an array of objects
 */
export const get: RequestHandler<{}, ServiceWithStatus[]> = async ({ url }) => {
	// you can opt out of using parsers by appending ?parsers=false to the url
	const useParsers = url.searchParams.get('parsers') !== 'false';

	const services = await fetchServices(true);
	const fetchers = StatusFetcher.fromServicesArray(services, useParsers);

	await Promise.all(fetchers.map((f) => f.fetch())); // concurrently fetch all statuses

	// return the statuses as a JSON object
	const values = fetchers.map((s) => s.toJson());

	return {
		body: values,
		headers: {
			'Content-Type': 'application/json'
		}
	};
};
