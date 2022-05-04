import StatusFetcher from '$/lib/statusfetcher';
import { fetchServices } from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetches the status of all services
 * and returns them as an array of objects
 */
export const get: RequestHandler = async ({ url }) => {
	// you can opt out of using parsers by appending ?parsers=false to the url
	const useParsers = url.searchParams.get('parsers') !== 'false';

	const services = await fetchServices();
	const fetchers = StatusFetcher.fromServicesArray(services, useParsers);

	const statuses = await Promise.all(fetchers.map((f) => f.fetch())); // concurrently fetch all statuses

	// return the statuses as a JSON object
	const values = statuses.map((s) => s.toJson());

	return {
		body: values,
		headers: {
			'Content-Type': 'application/json'
		}
	};
};
