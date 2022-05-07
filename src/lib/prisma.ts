import type { FullService } from '$/models/ServiceResponse';
import pkg, { type Service } from '@prisma/client';

const prisma = new pkg.PrismaClient();

export const fetchService = async <F extends boolean>(
	id: number,
	full: F
): Promise<F extends true ? FullService : Service> => {
	const service = await prisma.service.findFirst({
		where: {
			id
		},
		...(full
			? {
					include: {
						button: true,
						headers: true
					}
			  }
			: {})
	});

	if (!service) {
		throw new Error('Service not found');
	}

	return service as F extends true ? FullService : Service;
};

export const fetchServices = async <F extends boolean>(
	full: F
): Promise<F extends true ? FullService[] : Service[]> => {
	const services = await prisma.service.findMany(
		full
			? {
					include: {
						button: true,
						headers: true
					}
			  }
			: undefined
	);

	return services;
};

export default prisma;
