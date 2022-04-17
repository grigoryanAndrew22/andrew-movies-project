import { API_CONFIG } from '../environment/api';
// import MovieService from './MovieService';
import { Genre } from '../models/genres.interfarce';
import { AxiosResponse } from 'axios';
import { MovieInterface } from '../models/movies.interface';

class Movie {
	requestService(moviesData: AxiosResponse, genres: Genre[]): MovieInterface[] {
		try {
			const movies: MovieInterface[] = moviesData.data.results.map(
				(movie: MovieInterface) => {
					const genresName: string[] = movie.genre_ids.map(
						(genreId: number) => {
							return genres.filter((genre: Genre) => genre.id === genreId)[0]
								.name;
						}
					);

					return {
						image: API_CONFIG.imageBaseUrl + movie.poster_path,
						title: movie.title,
						year: movie.release_date,
						genre: genresName,
						movieId: movie.id,
					};
				}
			);
			return movies;
		} catch (err) {}
	}

	requestById(movieByIdData: AxiosResponse): MovieInterface {
		const genresName: string[] = movieByIdData.data.genres.map(
			(genre: Genre) => genre.name
		);
		const movieObjById: MovieInterface = {
			image: API_CONFIG.imageBaseUrl + movieByIdData.data.poster_path,
			title: movieByIdData.data.title,
			year: movieByIdData.data.release_date,
			genre: genresName,
			overview: movieByIdData.data.overview,
			vote_average: movieByIdData.data.vote_average,
		};
		return movieObjById;
	}
}

export default Movie;
