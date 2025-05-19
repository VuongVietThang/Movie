import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const MovieCard = ({ movie }) => {
  // Phân biệt các kiểu key (OMDb vs dữ liệu từ backend)
  const movieId = movie.imdbID || movie.id;
  const title = movie.Title || movie.title;
  const posterUrl = movie.poster_url
  ? `http://localhost/Movie-react/backend/Image/${movie.poster_url}`
  : '/default.jpg'; // Nếu backend không có ảnh
  const year = movie.Year || (movie.release_date ? movie.release_date.split('-')[0] : 'N/A');
const type = Array.isArray(movie.genres) && movie.genres.length > 0
  ? movie.genres.map(g => g.name).join(', ')
  : 'Movie';

  return (
    <div className="single-movie">
      <div className="movie-poster">
        <Link className="link" to={`/movie/${movieId}`}>
          <img src={posterUrl} alt="movie-poster" />
        </Link>
      </div>
      <div className="movie-content">
        <div className="top row">
          <h5 className="title">
            <Link className="link" to={`/movie/${movieId}`}>
              {title.length > 20 ? title.slice(0, 20) + '...' : title}
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
