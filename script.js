const IMAGE_BASE_URL = 'http://image.tmdb.org/t/p/w500';
const API = 'https://api.themoviedb.org/3';
const API_KEY = 'e1036725d4b220e51c48c798d13bcf37';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies-list');
const searchBTN = document.querySelector('.search-btn');
const pageNumbersWrapper = document.querySelector('.page-numbers-wrapper');
const btnPrev = document.querySelector('.btn-prev');
const filterContainer = document.querySelector('.filters-list');
const allFilterInputs = document.querySelectorAll('.filter-input');

let curPage = 1;
let pageIndex = 0;
let paginationNumbersArray = [];
let genres = [];
let pages = [];
let searchQuery;
let checkSearch;
let totalPages;
let filterVar;
let filteredMovies = [];
let clickedCheckbox;
let multipleFilters;

const uncheckAllInputs = () => {
  [...allFilterInputs].forEach((inp) => (inp.checked = false));
};

const renderMoviesOnView = (movies, genres, multipleFilt = false) => {
  if (multipleFilt === false) {
    moviesContainer.innerHTML = '';
  }

  for (let i = 0; i < movies.length; i++) {
    const foundGenres = genres.data.genres.find(
      (genre) => genre.id === movies[i].genre_ids[0]
    ).name;
    // console.log(foundGenres);

    const formatReleaseYear = movies[i].release_date.slice(0, 4);

    const markup = `
    <div class="movie-card">
        <img
          src="${IMAGE_BASE_URL}${movies[i].poster_path}"
          alt="poster"
          class="movie-image"
        />
        <div class="description">
          <p class="film-name">${movies[i].title}</p>
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

  if (curPage === 1) {
    btnPrev.classList.add('disabled');
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

const getGenres = async (
  search = false,
  value,
  filter = false,
  filterQuery
) => {
  try {
    const genresData = await axios.get(
      `${API}/genre/movie/list?api_key=${API_KEY}`
    );

    genres = genresData;
    if (search === true) {
      getMoviesDataAndLoad(value, 1, genres, 'getGenres', true, value);
    } else if (search === false) {
      if (filter === false) {
        getMoviesDataAndLoad('', 1, genres, 'getGenres', false);
      } else if (filter === true) {
        getMoviesDataAndLoad(
          '',
          curPage,
          genres,
          'getGenres',
          false,
          true,
          filterQuery
        );
      }
    }
  } catch (err) {}
};

const getMoviesDataAndLoad = async (
  value,
  page,
  genres,
  action,
  search,
  filterCheck = false,
  filter = ''
) => {
  try {
    if (search) {
      const movies1 = await axios.get(
        `${API}/search/movie?api_key=${API_KEY}&query=${value}&page=${page}`
      );
      checkSearch = true;
      totalPages = movies1.data.total_pages;
      console.log(movies1.data);
      renderPages(movies1.data.total_pages, action);
      renderMoviesOnView(movies1.data.results, genres);
    } else if (!search) {
      const movies2 = await axios.get(
        `${API}/movie/top_rated?api_key=${API_KEY}&page=${page}`
      );
      checkSearch = false;
      totalPages = movies2.data.total_pages;
      if (filterCheck === true && clickedCheckbox.checked) {
        const filtered = movies2.data.results.filter(
          (mov) =>
            filter ===
            genres.data.genres
              .find((genre) => genre.id === mov.genre_ids[0])
              .name.toLowerCase()
        );

        renderPages(movies2.data.total_pages, action);
        if ((multipleFilters = true)) {
          renderMoviesOnView(filtered, genres, true);
          return;
        }
        renderMoviesOnView(filtered, genres);
        return;
      }

      moviesContainer.innerHTML = '';
      renderPages(movies2.data.total_pages, action);
      renderMoviesOnView(movies2.data.results, genres);
    }
    console.log(movies.data);
  } catch (error) {}
};

const onPageClick = (e) => {
  e.preventDefault();
  uncheckAllInputs();
  if (clickedCheckbox && clickedCheckbox.checked) {
    clickedCheckbox.checked = false;
  }
  if (e.target.classList.contains('page')) {
    moviesContainer.innerHTML = '';
    document
      .querySelectorAll('.page')
      .forEach((p) => p.classList.remove('disabled'));
    curPage = parseInt(e.target.getAttribute('data-page'));
    e.target.classList.toggle('disabled');
    if (checkSearch) {
      getMoviesDataAndLoad(searchQuery, curPage, genres, 'pageClick', true);
    } else {
      getMoviesDataAndLoad('', curPage, genres, 'pageClick');
    }
  }
};

const onPreviousPage = () => {
  uncheckAllInputs();
  curPage = curPage - 1;
  getMoviesDataAndLoad('', curPage, genres, 'prevPage');
};

const onNextPage = () => {
  uncheckAllInputs();
  curPage = curPage + 1;
  getMoviesDataAndLoad('', curPage, genres, 'nextPage');
};

getGenres(false);

const search = (event) => {
  event.preventDefault();
  const inputVal = searchInput.value;
  searchQuery = searchInput.value;
  getGenres(true, inputVal);
  curPage = 1;
  searchInput.value = '';
  searchInput.blur();
};

// searchForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const inputVal = searchInput.value;
//   searchQuery = searchInput.value;
//   getGenres(true, inputVal);
//   curPage = 1;
//   searchInput.value = '';
//   searchInput.blur();
// });

const filter = (event) => {
  const allFilterInputsArr = [...allFilterInputs];
  const filteredArr = allFilterInputsArr.filter(
    (input) => input !== event.target
  );

  if (!event.target.checked && filteredArr.some((inp) => inp.checked)) {
    const checkedFilterArr = filteredArr.filter((inp) => inp.checked);
    moviesContainer.innerHTML = '';
    if (checkedFilterArr.length > 1) {
      checkedFilterArr.forEach((filt) => {
        multipleFilters = true;
        filterVar = filt.getAttribute('data-genre-name');
        getGenres(false, '', true, filterVar);
      });
    } else if (checkedFilterArr.length === 1) {
      multipleFilters = false;
      filterVar = checkedFilterArr[0].getAttribute('data-genre-name');
      getGenres(false, '', true, filterVar);
    }
    return;
  }

  if (
    event.target.hasAttribute('data-genre-name') &&
    filteredArr.some((inp) => inp.checked)
  ) {
    multipleFilters = true;
    filterVar = event.target.getAttribute('data-genre-name');
    getGenres(false, '', true, filterVar);
    clickedCheckbox = event.target;
    return;
  }

  if (event.target.hasAttribute('data-genre-name')) {
    moviesContainer.innerHTML = '';
    filterVar = event.target.getAttribute('data-genre-name');
    getGenres(false, '', true, filterVar);
    clickedCheckbox = event.target;
  }
};
