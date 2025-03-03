const dateFormatter = (date: Date): string => {
	return date
		?.toLocaleDateString('ro-RO', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
		.replace('/', '.') ?? '00.00.0000';
};

export default dateFormatter;
