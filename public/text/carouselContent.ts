interface CarouselCategoryModel {
	image: any;
	logo: any;
	title: string;
}

const categories: CarouselCategoryModel[] = [
	{
		image: '/images/literature.jpg',
		logo: '/icons/book.svg',
		title: 'Literatură'
	},
	{
		image: '/images/cinematography.jpg',
		logo: '/icons/film.svg',
		title: 'Film'
	},
	{
		image: '/images/art.jpg',
		logo: '/icons/palette.svg',
		title: 'Artă'
	}
];

export { categories };
