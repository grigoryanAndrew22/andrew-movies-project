import './styles.scss';

import { Genre } from './models/genres.interfarce';
import { /*MovieInterface*/ MoviesType } from './models/movies.interface';
import Renderer from './components/Renderer';
import Pagination from './components/Pagination';
import MovieService from './components/MovieService';
import { API_CONFIG } from './environment/api';
import Movie from './components/Movie';

const movieWrapper: HTMLDivElement = document.querySelector(
  '.body-movie-content-wrapper'
);
const paginationContainer: HTMLDivElement = document.querySelector(
  '.pagination-container'
);
const searchInput: HTMLInputElement = document.querySelector(
  '.header-seacrh-input'
);
const movieContentList: HTMLDivElement = document.querySelector(
  '.movie-content-list'
);
const movieDetails: HTMLDivElement = document.querySelector('.movie-details');
const detailsContainer: HTMLDivElement =
  document.querySelector('.details-container');
const selectMoviesTypeContainer: HTMLSelectElement = document.querySelector(
  '.select-movie-rates'
);
const filterGenreBody: HTMLDivElement =
  document.querySelector('.filter-genre-body');
const searchBtn: HTMLButtonElement = document.querySelector('.search-btn');
const selectMoviesType: HTMLSelectElement = document.querySelector(
  '.select-movie-rates'
);
const applyFilterBtn: HTMLButtonElement =
  document.querySelector('.apply-genres-btn');
const detailBackBtn: HTMLButtonElement = document.querySelector(
  '.detail-back-button'
);

let genres: Genre[];
let currentRequestType = 'top_rated';

const moviesType: MoviesType[] = [
  { value: 'top_rated', title: 'Top Rated' },
  { value: 'popular', title: 'Popular' },
  { value: 'upcoming', title: 'Upcoming' },
];
const genresToSend: number[] = [];

const onMovieClick = (event: PointerEvent): void => {
  movieContentList.style.display = 'none';
  movieDetails.style.display = 'flex';

  const movieId: number = parseInt(
    (event.target as Element).parentElement.getAttribute('data-movie-id')
  );

  getMovieById(movieId);
};

const onChooseGenre = (event: PointerEvent): void => {
  const genreId: number = parseInt(
    (event.target as Element).getAttribute('data-genre-id')
  );

  if (genresToSend.length === 0) {
    genresToSend.push(genreId);
  } else {
    const isGenresIdIncluded: boolean = genresToSend.some(
      (genre: number) => genre === genreId
    );
    const genreIndex: number = genresToSend.indexOf(genreId);

    if (isGenresIdIncluded) {
      genresToSend.splice(genreIndex, 1);
    } else {
      genresToSend.push(genreId);
    }
  }
};

const getMoviesOnCondition = async (
  requestType: string,
  page: number,
  action: string
): Promise<void> => {
  let url = '';

  currentRequestType = requestType;

  const isRequestTypeIncluded: boolean = moviesType.some(
    (movieType) => movieType.value === requestType
  );

  if (isRequestTypeIncluded) {
    url = `${API_CONFIG.apiUrl}/movie/${requestType}?api_key=${API_CONFIG.apiKey}&page=${page}`;
  } else if (requestType === 'search' && !searchInput.value) {
    url = `${API_CONFIG.apiUrl}/movie/top_rated?api_key=${API_CONFIG.apiKey}&page=${page}`;
  } else if (requestType === 'genresFiltered') {
    url = `${API_CONFIG.apiUrl}/discover/movie?api_key=${API_CONFIG.apiKey}&page=${page}&with_genres=${genresToSend}`;
  } else {
    url = `${API_CONFIG.apiUrl}/search/movie?api_key=${API_CONFIG.apiKey}&query=${searchInput.value}&page=${page}`;
  }

  try {
    const moviesData = await movieService.getRequest(url);

    const movies = movieRequestService.requestService(moviesData, genres);

    pagination.renderPages(
      moviesData.data.total_pages,
      action,
      currentRequestType
    );
    renderer.renderMovie(movies);
  } catch (err) {}
};

const getMovieById = async (movieId: number): Promise<void> => {
  try {
    const url = `${API_CONFIG.apiUrl}/movie/${movieId}?api_key=${API_CONFIG.apiKey}`;
    const movieByIdData = await movieService.getRequest(url);
    const movieObjById = movieRequestService.requestById(movieByIdData);
    renderer.renderDetailsPage(movieObjById);
  } catch (err) {}
};

const getGenres = async (): Promise<void> => {
  try {
    const url = `${API_CONFIG.apiUrl}/genre/movie/list?api_key=${API_CONFIG.apiKey}`;
    const genresResponse = await movieService.getRequest(url);
    genres = genresResponse.data.genres;
    renderer.renderGenres(genres);
  } catch (err) {}
};

const onBack = (): void => {
  movieDetails.style.display = 'none';
  movieContentList.style.display = 'flex';
};

const onSearch = (): void => {
  pagination.currentPage = 1;
  getMoviesOnCondition('search', pagination.currentPage, 'searchMovie');
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const onSelectMoviesType = async (event: any): Promise<void> => {
  pagination.currentPage = 1;
  getMoviesOnCondition(
    event.target.value,
    pagination.currentPage,
    'selectMoviesType'
  );
};

const onApplyFilter = (): void => {
  pagination.currentPage = 1;
  getMoviesOnCondition(
    'genresFiltered',
    pagination.currentPage,
    'applyGenresFilter'
  );
};

const pagination = new Pagination(paginationContainer, getMoviesOnCondition);
const movieService = new MovieService();
const renderer = new Renderer(
  movieWrapper,
  detailsContainer,
  filterGenreBody,
  selectMoviesTypeContainer,
  onMovieClick,
  onChooseGenre
);
const movieRequestService = new Movie();

renderer.renderMoviesTypes(moviesType);
getGenres();
getMoviesOnCondition('top_rated', pagination.currentPage, 'getMovies');

searchBtn.addEventListener('click', onSearch, false);
selectMoviesType.addEventListener('change', onSelectMoviesType, false);
applyFilterBtn.addEventListener('click', onApplyFilter, false);
detailBackBtn.addEventListener('click', onBack, false);

export default renderer;
