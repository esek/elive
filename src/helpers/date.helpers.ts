export const toDate = (d: Date | string) => {
	if (typeof d === 'string') {
		d = new Date(d);
	}

	return d.toLocaleString('sv-SE', {
		hour12: false,
		dateStyle: 'short',
		timeStyle: 'short'
	});
};
