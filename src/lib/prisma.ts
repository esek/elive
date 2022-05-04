import type { ServiceResponse } from '$/models/ServiceResponse';
import pkg from '@prisma/client';

const prisma = new pkg.PrismaClient();

export const fetchServices = async (): Promise<ServiceResponse[]> => {
	const services = await prisma.service.findMany({
		include: {
			status: {
				include: {
					headers: true
				}
			}
		}
	});

	return services.filter((s): s is ServiceResponse => s.status != null);
};

export default prisma;
