import React, { useState, useEffect } from "react";
import MovieCard from "../MovieCard";
import "./style.css";

const TopMovies = ({ watchList, setWatchList }) => {
  const [filterCtg, setFilterCtg] = useState(null);
  const [genres, setGenres] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const API_BASE = "http://localhost/Movie/backend/API";

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
            <>
              <button
                className={!filterCtg ? "btn category-btn active" : "btn category-btn"}
                onClick={() => setFilterCtg(null)}
              >
                Tất cả
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  className={filterCtg === genre.id ? "btn category-btn active" : "btn category-btn"}
                  onClick={() => setFilterCtg(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="row movies-grid">
          {loadingMovies ? (
            <p>Loading movies...</p>
          ) : topMovies.length > 0 ? (
            topMovies.map((movie) => (
              <MovieCard
                movie={movie}
                key={movie.id}
                setWatchList={setWatchList}
                watchList={watchList}
              />
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
