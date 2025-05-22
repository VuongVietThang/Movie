import React from "react";
import { Link } from "react-router-dom"; // <- thêm dòng này
import "./style.css";
const MovieCard = ({ movie, watchList, setWatchList }) => {
  const movieId = movie.id;
  const title = movie.title || "No title";

  const posterUrl = movie.poster_url
    ? `http://localhost/Movie/backend/Image/${movie.poster_url}`
    : "/default.jpg";

  const year = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";

  const type =
    Array.isArray(movie.genres) && movie.genres.length > 0
      ? movie.genres.map((g) => g.name).join(", ")
      : "Movie";

  const watchListIds = Array.isArray(watchList) ? watchList.map((item) => item.id) : [];

  const addToFavourite = (movie) => {
    if (watchListIds.includes(movie.id)) {
      alert("Phim đã có trong danh sách yêu thích!");
    } else {
      setWatchList([...watchList, movie]);
    }
  };

  const deleteFromWatchList = (id) => {
    const newWatchList = watchList.filter((item) => item.id !== id);
    setWatchList(newWatchList);
  };

  return (
    <div className="single-movie">
      <div className="movie-poster">
        <Link className="link" to={`/movie/${movieId}`}>
          <img src={posterUrl} alt="movie-poster" />
        </Link>
        <ul className="overlay-btns">
          {watchListIds.includes(movie.id) ? (
            <li>
              <button className="btn watch-btn" onClick={() => deleteFromWatchList(movie.id)}>
                Xóa khỏi yêu thích
              </button>
            </li>
          ) : (
            <li>
              <button className="btn watch-btn" onClick={() => addToFavourite(movie)}>
                Yêu thích
              </button>
            </li>
          )}
          <li>
            <Link className="btn details-btn" to={`/movie/${movieId}`}>
              Chi tiết
            </Link>
          </li>
        </ul>
      </div>

      <div className="movie-content">
        <div className="top row">
          <h5 className="title">
            <Link className="link" to={`/movie/${movieId}`}>
              {title.length > 20 ? title.slice(0, 20) + "..." : title}
            </Link>
          </h5>
          <h6 className="year">{year}</h6>
        </div>
        <div className="bottom row">
          <span className="quality">HD</span>
          <span className="type">{type}</span>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;
