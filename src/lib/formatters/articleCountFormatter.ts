const articleCountFormatter = (articles: number): string => {
	if (!articles) {
		return 'Niciun articol';
	}

	if (articles === 1) {
		return 'Vezi un articol';
	}

	if (articles < 20) {
		return `Vezi toate cele ${articles} articole`;
	}

	return `Vezi toate cele ${articles} de articole`;
};

export default articleCountFormatter;
