class Routes {
	public static readonly HOME = '/';
	public static readonly NEW = `/new`;
	public static readonly EDIT = (id: number) => `/edit/${id}`;
}

export default Routes;
