const API = 'https://api.themoviedb.org/3';
const API_KEY = 'e1036725d4b220e51c48c798d13bcf37';
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies-list');
const searchBTN = document.querySelector('.search-btn');
const paginationContainer = document.querySelector('.pagination');

/*
const getGenres = async (data, i) => {
  const genres = await fetch(`${API}/genre/movie/list?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => data.genres);

  genres.find((el) => el.id === data.results[i].genre_ids[0]);
};
*/

const loadMoviesOnView = async (data) => {
  const genres = await fetch(`${API}/genre/movie/list?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => data.genres);

  for (let i = 0; i < 10; i++) {
    const markup = `
    <div class="movie-card">
      <img
        src="img/1613108527_maxresdefault-51.jpg"
        alt=""
        class="movie-image"
      />
      <div class="description">
        <p class="film-name">${data.results[i].title}</p>
        <p class="genre">${
          genres.find((genre) => genre.id === data.results[i].genre_ids[0]).name
        }</p>
        <small class="release-year">${data.results[i].release_date.slice(
          0,
          4
        )}</small>
      </div>
    </div>`;
    moviesContainer.insertAdjacentHTML('beforeend', markup);
  }
};

const getMoviesDataAndLoad = (page = 1) => {
  fetch(`${API}/movie/top_rated?api_key=${API_KEY}&page=${+page}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => loadMoviesOnView(data));
};

getMoviesDataAndLoad();

paginationContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('page')) {
    // e.preventDefault();
    moviesContainer.innerHTML = '';
    let curPage = 1;
    document.querySelector(`.page-${curPage}`).classList.toggle('disabled');
    curPage = e.target.className[10];
    e.target.classList.toggle('disabled');
    getMoviesDataAndLoad(curPage);
  }
});

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
