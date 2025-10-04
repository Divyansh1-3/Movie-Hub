document.addEventListener("DOMContentLoaded", () => {
  // =======================
  // Movie Data
  // =======================
  const movies = [
    { title: "Attack on Titan", genre: "Anime", rating: 9.1, image: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg" },
    { title: "Death Note", genre: "Anime", rating: 9.0, image: "https://m.media-amazon.com/images/M/MV5BODkzMjhjYTQtYmQyOS00NmZlLTg3Y2UtYjkzN2JkNmRjY2FhXkEyXkFqcGdeQXVyNTM4MDQ5MDc@._V1_.jpg" },
    { title: "Naruto: Shippuden", genre: "Anime", rating: 8.4, image: "https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg" },
    { title: "One Piece", genre: "Anime", rating: 9.0, image: "https://m.media-amazon.com/images/M/MV5BODcwNWE3OTMtMDc3MS00NDFjLWE1OTAtNDU3NjgxODMxY2UyXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg" },
    { title: "Jujutsu Kaisen", genre: "Anime", rating: 8.8, image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQFPaS5RyGmBuMRKAWvbKox-wYy0XzTP0OK0RV8xHiIlEj8mLcLuZwuPKUsTJgJkdXSBxAE" },
    { title: "Breaking Bad", genre: "Series", rating: 9.5, image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg" },
    { title: "Stranger Things", genre: "Series", rating: 8.7, image: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg" },
    { title: "The Witcher", genre: "Series", rating: 8.2, image: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg" },
    { title: "Money Heist", genre: "Series", rating: 8.3, image: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg" },
    { title: "Peaky Blinders", genre: "Series", rating: 8.8, image: "https://image.tmdb.org/t/p/w500/bGZn5RVzMMXju4ev7xbl1aLdXqq.jpg" },
    { title: "Inception", genre: "Movie", rating: 8.8, image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
    { title: "Interstellar", genre: "Movie", rating: 8.6, image: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg" },
    { title: "The Batman (2022)", genre: "Movie", rating: 8.3, image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
    { title: "John Wick 4", genre: "Movie", rating: 8.7, image: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg" },
    { title: "Avengers: Endgame", genre: "Movie", rating: 8.4, image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" }
  ];

  // =======================
  // DOM Elements
  // =======================
  const movieContainer = document.getElementById("movieContainer");
  const genreSelect = document.getElementById("genreFilter");
  const sortSelect = document.getElementById("sortBy");
  const paginationContainer = document.getElementById("pagination");
  const modal = document.getElementById("movieModal");
  const modalContent = document.querySelector(".modal-content");
  const watchlistBtn = document.getElementById("watchlistBtn");
  const homeBtn = document.getElementById("homeBtn");
  const headerTitle = document.querySelector('header h1');

  // =======================
  // State Variables
  // =======================
  let currentPage = 1;
  const moviesPerPage = 8;
  let currentView = 'home'; // Can be 'home' or 'watchlist'
  let currentMovieList = [...movies];
  
  // Load watchlist from localStorage or initialize as empty array
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // =======================
  // Core Functions
  // =======================

  // Display Movies
  function displayMovies(movieList) {
    movieContainer.innerHTML = "";
    if (movieList.length === 0) {
      movieContainer.innerHTML = `<p style="text-align: center; width: 100%;">${currentView === 'watchlist' ? 'Your watchlist is empty.' : 'No movies found.'}</p>`;
      renderPagination(0);
      return;
    }

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = movieList.slice(start, end);

    paginatedMovies.forEach(movie => {
      const card = document.createElement("div");
      card.classList.add("movie-card");
      const isAdded = watchlist.includes(movie.title);
      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.rating} | ${movie.genre}</p>
        <button class="add-btn ${isAdded ? 'added' : ''}">${isAdded ? "✓ Added" : "+ Add to Watchlist"}</button>
      `;

      card.querySelector("img").addEventListener("click", () => openModal(movie));
      const addBtn = card.querySelector(".add-btn");
      addBtn.addEventListener("click", () => toggleWatchlist(movie, addBtn));
      movieContainer.appendChild(card);
    });

    renderPagination(movieList.length);
  }

  // Render Pagination
  function renderPagination(totalMovies) {
    const totalPages = Math.ceil(totalMovies / moviesPerPage);
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) {
        btn.classList.add("active");
      }
      btn.addEventListener("click", () => {
        currentPage = i;
        displayMovies(currentMovieList);
      });
      paginationContainer.appendChild(btn);
    }
  }

  // Handle Filtering and Sorting
  function applyFiltersAndSort() {
    let filtered = (currentView === 'home') 
        ? [...movies] 
        : movies.filter(movie => watchlist.includes(movie.title));

    const genre = genreSelect.value;
    const sortBy = sortSelect.value;

    if (genre !== "all") {
      filtered = filtered.filter(m => m.genre === genre);
    }

    if (sortBy === "ratingHigh") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "ratingLow") {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    currentMovieList = filtered;
    currentPage = 1;
    displayMovies(currentMovieList);
  }

  // =======================
  // Watchlist Functions
  // =======================

  function toggleWatchlist(movie, button) {
    const index = watchlist.indexOf(movie.title);
    if (index !== -1) {
      watchlist.splice(index, 1); // Remove from watchlist
      button.textContent = "+ Add to Watchlist";
      button.classList.remove("added");
    } else {
      watchlist.push(movie.title); // Add to watchlist
      button.textContent = "✓ Added";
      button.classList.add("added");
    }
    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    // If in watchlist view, refresh to show the change immediately
    if (currentView === 'watchlist') {
        applyFiltersAndSort();
    }
  }

  function showWatchlist() {
    currentView = 'watchlist';
    headerTitle.textContent = "📜 My Watchlist";
    document.querySelector('.controls').style.display = 'none'; // Hide filters on watchlist page
    applyFiltersAndSort();
  }
  
  function showHome() {
    currentView = 'home';
    headerTitle.textContent = "🎬 Movie/Series/Anime Hub";
    document.querySelector('.controls').style.display = 'flex'; // Show filters
    applyFiltersAndSort();
  }

  // =======================
  // Modal Functions
  // =======================

  function openModal(movie) {
    modal.style.display = "flex";
    modalContent.innerHTML = `
      <span class="close">&times;</span>
      <img src="${movie.image}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p><strong>Genre:</strong> ${movie.genre}</p>
      <p><strong>Rating:</strong> ⭐ ${movie.rating}</p>
    `;

    modal.querySelector(".close").addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Close modal if clicked outside of content
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  // =======================
  // Event Listeners
  // =======================
  genreSelect.addEventListener("change", applyFiltersAndSort);
  sortSelect.addEventListener("change", applyFiltersAndSort);
  watchlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showWatchlist();
  });
  homeBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent page reload to maintain state
      showHome();
  });

  // =======================
  // Initial Render
  // =======================
  showHome(); // Start on the home page view
});