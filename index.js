const API_KEY = '0dde63587240e343e46963b140d88bc5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieList = document.getElementById('movie-list');
const noResults = document.getElementById('no-results');
const loadMoreButton = document.getElementById('load-more');

let currentPage = 1; // 현재 페이지 번호
let totalPages = 1; // 총 페이지 수
let currentQuery = ''; // 현재 검색어

// 영화 카드 생성 함수
const createMovieCard = (movie) => {
    const { title, poster_path, vote_average } = movie;

    const card = document.createElement('div');
    card.classList.add('movie-card');

    const img = document.createElement('img');
    img.src = poster_path ? `${IMAGE_BASE_URL}${poster_path}` : 'placeholder.png'; 
    img.alt = title;

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const voteElement = document.createElement('p');
    voteElement.textContent = `${vote_average.toFixed(1)}⭐`;


    card.appendChild(img);
    card.appendChild(titleElement);
    card.appendChild(voteElement);

    return card;
};

// 영화 렌더링 함수
const renderMovies = (movies) => {
    if (currentPage === 1) movieList.innerHTML = ''; //c초기화

    if (movies.length === 0) {
        noResults.style.display = 'block';
        loadMoreButton.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';

    movies.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
    });

    loadMoreButton.style.display = currentPage < totalPages ? 'block' : 'none';
};

// 인기 영화
const fetchPopularMovies = async (page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=${page}`
        );
        const data = await response.json();

        totalPages = data.total_pages;
        renderMovies(data.results);
    } catch (error) {
        console.error('인기 영화를 불러오는 중 오류 발생:', error);
    }
};

// 검색 결과
const fetchSearchMovies = async (query, page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=ko-KR&page=${page}`
        );
        const data = await response.json();

        totalPages = data.total_pages; 
        renderMovies(data.results);
    } catch (error) {
        console.error('검색 결과를 불러오는 중 오류 발생:', error);
    }
};

// 검색 버튼 클릭
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert('검색어를 입력하세요.');
        return;
    }

    currentQuery = query;
    currentPage = 1;
    fetchSearchMovies(currentQuery, currentPage);
});

// 더보기 버튼 클릭
loadMoreButton.addEventListener('click', () => {
    if (currentQuery && currentPage < totalPages) {
        currentPage++;
        fetchSearchMovies(currentQuery, currentPage);
    } else if (!currentQuery && currentPage < totalPages) {
        currentPage++;
        fetchPopularMovies(currentPage);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

fetchPopularMovies();
