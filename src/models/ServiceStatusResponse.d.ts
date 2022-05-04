export type ServiceStatusResponse = {
	id: number;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date;
	label: string;
	url: string;
	status: {
		success: boolean;
		data: string;
		color: string;
	};
};
