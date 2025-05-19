import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard';
import './style.css';

const TopMovies = () => {
  const [filterCtg, setFilterCtg] = useState('');
  const [genres, setGenres] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const API_BASE = "http://localhost/Movie-react/backend/API";
  // Fetch genres khi component mount
  useEffect(() => {
    setLoadingGenres(true);
    fetch(`${API_BASE}/genres.php`)
      .then((res) => res.json())
      .then((data) => {
        setGenres(data);
        setLoadingGenres(false);
      })
      .catch(() => {
        setGenres([]);
        setLoadingGenres(false);
      });
  }, []);

  // Fetch movies khi filterCtg thay đổi
  useEffect(() => {
    setLoadingMovies(true);
    let url = `${API_BASE}/movies.php`;
    if (filterCtg) {
      url += `?genre=${filterCtg}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTopMovies(data);
        setLoadingMovies(false);
      })
      .catch(() => {
        setTopMovies([]);
        setLoadingMovies(false);
      });
  }, [filterCtg]);

  const handleFilterCtg = (e) => {
    setFilterCtg(e.target.textContent);
  };

  return (
    <section className="new-sec top-rated-sec" id="movies">
      <div className="container">
        <div className="section-title">
          <h5 className="sub-title">ONLINE STREAMING</h5>
          <h2 className="title">Top Rated Movies</h2>
        </div>

        <div className="btns-div categories-btns">
          {loadingGenres ? (
            <p>Loading genres...</p>
          ) : (
            genres.map((genre) => (
              <button
                key={genre.id}
                className={
                  filterCtg === genre.name
                    ? 'btn category-btn active'
                    : 'btn category-btn'
                }
                onClick={handleFilterCtg}
              >
                {genre.name}
              </button>
            ))
          )}
        </div>

        <div className="row movies-grid">
          {loadingMovies ? (
            <p>Loading movies...</p>
          ) : topMovies.length > 0 ? (
            topMovies.map((movie) => (
              <MovieCard movie={movie} key={movie.imdbID || movie.id} />
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopMovies;
