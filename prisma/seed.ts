import pkg from '@prisma/client';

const { PrismaClient, ServiceStatusType } = pkg;

// needed for the seed file to work as it's under --isolatedModules
export {};

const testingService: pkg.Prisma.ServiceCreateInput = {
	name: 'Testing Service',
	description: 'This is a test service',
	status: {
		create: {
			statusUrl: 'https://jsonplaceholder.typicode.com/posts/1',
			method: 'GET',
			type: ServiceStatusType.JSON,
			parser: '$.title'
		}
	}
};

const seed = async () => {
	const client = new PrismaClient();

	// delete all records
	await client.service.deleteMany();

	client.service
		.create({
			data: testingService,
			include: {
				status: {
					include: {
						headers: true
					}
				}
			}
		})
		.then(() => {
			console.log('🌷 Seeding complete');
		})
		.catch(() => {
			console.log('💀 Seeding failed');
		});
};

seed();
