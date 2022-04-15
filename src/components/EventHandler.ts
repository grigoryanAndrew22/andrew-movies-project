import Pagination from './Pagination';

class EventHanlder extends Pagination {
	public _genresToSend: number[] = [];

	constructor(
		public movieDetails: HTMLDivElement,
		public movieContentList: HTMLDivElement,
		public paginationContainer: HTMLDivElement,
		public getMoviesOnCondition: (
			requestType: string,
			page: number,
			action: string
		) => Promise<void>,
		public getMovieById: (movieId: number) => Promise<void>
	) {
		super(paginationContainer, getMoviesOnCondition);
		// this.pagination = new Pagination(
		// 	this.paginationContainer,
		// 	this.getMoviesOnCondition
		// );
		this.genresToSend = [];
	}

	public get genresToSend(): number[] {
		return this._genresToSend;
	}

	public set genresToSend(value: number[]) {
		this._genresToSend = value;
	}

	public onMovieClick(event: PointerEvent): void {
		this.movieContentList.style.display = 'none';
		this.movieDetails.style.display = 'flex';

		const movieId: number = parseInt(
			(event.target as Element).parentElement.getAttribute('data-movie-id')
		);

		this.getMovieById(movieId);
	}

	public onChooseGenre(event: PointerEvent): void {
		const genreId: number = parseInt(
			(event.target as Element).getAttribute('data-genre-id')
		);

		if (this.genresToSend.length === 0) {
			this.genresToSend.push(genreId);
		} else {
			const isGenresIdIncluded: boolean = this.genresToSend.some(
				(genre: number) => genre === genreId
			);
			const genreIndex: number = this.genresToSend.indexOf(genreId);

			if (isGenresIdIncluded) {
				this.genresToSend.splice(genreIndex, 1);
			} else {
				this.genresToSend.push(genreId);
			}
		}
	}

	public onBack(): void {
		this.movieDetails.style.display = 'none';
		this.movieContentList.style.display = 'flex';
	}

	public onSearch(): void {
		this.currentPage = 1;
		this.getMoviesOnCondition('search', this.currentPage, 'searchMovie');
	}

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	public onSelectMoviesType(event: any): void {
		this.currentPage = 1;
		this.getMoviesOnCondition(
			event.target.value,
			this.currentPage,
			'selectMoviesType'
		);
	}

	public onApplyFilter(): void {
		this.currentPage = 1;
		this.getMoviesOnCondition(
			'genresFiltered',
			this.currentPage,
			'applyGenresFilter'
		);
	}
}

export default EventHanlder;
