const IMAGE_BASE_URL = 'http://image.tmdb.org/t/p/w500';
const API = 'https://api.themoviedb.org/3';
const API_KEY = 'e1036725d4b220e51c48c798d13bcf37';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies-list');
const searchBTN = document.querySelector('.search-btn');
const pageNumbersWrapper = document.querySelector('.page-numbers-wrapper');

let curPage = 1;
let pageIndex = 0;
let paginationNumbersArray = [];
let genres = [];
let pages = [];

const renderMoviesOnView = (movies, genres) => {
  moviesContainer.innerHTML = '';

  for (let i = 0; i < 20; i++) {
    const foundGenres = genres.data.genres.find(
      (genre) => genre.id === movies.results[i].genre_ids[0]
    ).name;
    console.log(foundGenres);
    const formatReleaseYear = movies.results[i].release_date.slice(0, 4);

    const markup = `<div class="movie-card">
        <img
          src="${IMAGE_BASE_URL}${movies.results[i].poster_path}"
          alt="poster"
          class="movie-image"
        />
        <div class="description">
          <p class="film-name">${movies.results[i].title}</p>
          <p class="genre">${foundGenres}</p>
          <small class="release-year">${formatReleaseYear}</small>
        </div>
      </div>`;

    moviesContainer.innerHTML += markup;
  }
};

const renderPages = (totalPages, action) => {
  pageNumbersWrapper.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (paginationNumbersArray[paginationNumbersArray.length - 1] === curPage) {
    pageIndex = curPage - 1;
  }

  if (
    paginationNumbersArray[0] === curPage &&
    paginationNumbersArray[0] !== 1
  ) {
    pageIndex = curPage - 5;
  }
  if (
    !paginationNumbersArray.includes(curPage) &&
    (action === 'prevPage' || action === 'pageClick')
  ) {
    if (curPage === 4) {
      pageIndex = 0;
    } else {
      pageIndex = curPage - 5;
    }
  }
  if (
    !paginationNumbersArray.includes(curPage) &&
    action === 'nextPage' &&
    curPage !== totalPages - 4
  ) {
    pageIndex = curPage + 5;
  }

  paginationNumbersArray = pages.slice(pageIndex, pageIndex + 5);

  for (let i = 0; i < paginationNumbersArray.length; i++) {
    const markup = `
      <button data-page="${paginationNumbersArray[i]}" class="page ${
      paginationNumbersArray[i] === curPage ? 'disabled' : ''
    }">${paginationNumbersArray[i]}</button>
    `;

    pageNumbersWrapper.innerHTML += markup;
  }
};

const getGenres = async () => {
  try {
    const genresData = await axios.get(
      `${API}/genre/movie/list?api_key=${API_KEY}`
    );

    genres = genresData;
    getMoviesDataAndLoad(1, genres, 'getGenres');
  } catch (err) {}
};

const getMoviesDataAndLoad = async (page, genres, action) => {
  try {
    const movies = await axios.get(
      `${API}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    );

    renderPages(movies.data.total_pages, action);
    renderMoviesOnView(movies.data, genres);
  } catch (error) {}
};

const onPageClick = (e) => {
  if (e.target.classList.contains('page')) {
    moviesContainer.innerHTML = '';
    document
      .querySelectorAll('.page')
      .forEach((p) => p.classList.remove('disabled'));
    curPage = parseInt(e.target.getAttribute('data-page'));
    e.target.classList.toggle('disabled');
    getMoviesDataAndLoad(curPage, genres, 'pageClick');
  }
};

const onPreviousPage = () => {
  curPage = curPage - 1;
  getMoviesDataAndLoad(curPage, genres, 'prevPage');
};

const onNextPage = () => {
  curPage = curPage + 1;
  getMoviesDataAndLoad(curPage, genres, 'nextPage');
};

getGenres();

/*
const searchFunctional = async () => {
  moviesContainer.innerHTML = '';
  const data = await fetch(
    `${API}/search/movie?api_key=${API_KEY}&query=${searchInput.value}`
  )
    .then((res) => res.json())
    .then((data) => data.results);

  const genres = await fetch(`${API}/genre/movie/list?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => data.genres);

  data.forEach((film) => {
    const markup = `
    <div class="movie-card">
      <img
        src="img/1613108527_maxresdefault-51.jpg"
        alt=""
        class="movie-image"
      />
      <div class="description">
        <p class="film-name">${film.title}</p>
        <p class="genre">action</p>
        <small class="release-year">${film.release_date.slice(0, 4)}</small>
        </div>
        </div>`;

    moviesContainer.insertAdjacentHTML('beforeend', markup);
  });
};

// searchFunctional();

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchFunctional();
  searchInput.value = '';
  searchInput.blur();
});

// genres.find((genre) => genre.id === film.genre_ids[0]).name
*/
