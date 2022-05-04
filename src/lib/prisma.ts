import pkg from '@prisma/client';

const prisma = new pkg.PrismaClient();

export type ServiceWithStatus = pkg.Service & {
	status: pkg.ServiceStatus & {
		headers: pkg.StatusHeader[];
	};
};

export const fetchServices = async (): Promise<ServiceWithStatus[]> => {
	const services = await prisma.service.findMany({
		include: {
			status: {
				include: {
					headers: true
				}
			}
		}
	});

	return services.filter((s): s is ServiceWithStatus => s.status != null);
};

export default prisma;
