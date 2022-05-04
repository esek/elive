import pkg from '@prisma/client';

const { PrismaClient, ServiceStatusType } = pkg;

// needed for the seed file to work as it's under --isolatedModules
export {};

const TEST_DATA: pkg.Prisma.ServiceCreateInput[] = [
	{
		name: 'Posts',
		description: 'This is a test service fetching posts',
		status: {
			create: {
				label: 'posts',
				statusUrl: 'https://jsonplaceholder.typicode.com/posts',
				method: 'GET',
				type: ServiceStatusType.JSON,
				parser: '$.length'
			}
		}
	},
	{
		name: 'Users',
		description: 'This is a test service fetching users',
		status: {
			create: {
				label: 'name',
				statusUrl: 'https://jsonplaceholder.typicode.com/users/1',
				method: 'GET',
				type: ServiceStatusType.JSON,
				parser: '$.name'
			}
		}
	}
];

const seed = async () => {
	const client = new PrismaClient();

	// delete all records
	await client.service.deleteMany();

	Promise.all(
		TEST_DATA.map((s) =>
			client.service.create({
				data: s,
				include: {
					status: {
						include: {
							headers: true
						}
					}
				}
			})
		)
	)
		.then(() => {
			console.log('🌷 Seeding complete');
		})
		.catch(() => {
			console.log('💀 Seeding failed');
		});
};

seed();
