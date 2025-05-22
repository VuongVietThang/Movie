import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`http://localhost/Movie/backend/API/movie_detail.php?id=${id}`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi mạng hoặc không tìm thấy phim");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setMovie(null);
        } else {
          setMovie(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "Lỗi khi tải dữ liệu phim");
          setMovie(null);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (error) {
    return (
      <div className="movie-details-error">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!movie) {
    return <div className="movie-details-loading">Đang tải dữ liệu...</div>;
  }

  const lastWord = movie.title ? movie.title.split(" ").pop() : "";

  return (
    <header className="page-header movie-details-header">
      <div className="container">
        <div className="movie-details">
          <div className="movie-poster">
            <img
              src={
                movie.poster_url
                  ? `http://localhost/Movie/backend/Image/${movie.poster_url}`
                  : "/default.jpg"
              }
              alt={movie.title}
            />
          </div>
          <div className="details-content">
            {movie.author && (
              <h5 className="director">{movie.author.split(",")[0]}</h5>
            )}
            <h2 className="title">
              {movie.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span>{lastWord}</span>
            </h2>
            <div className="banner-meta">
              <ul>
                <li className="vid">
                  <span className="type">
                    {movie.genres && movie.genres.length > 0
                      ? movie.genres.map((g) => g.name).join(", ")
                      : "Unknown"}
                  </span>
                  <span className="quality">HD</span>
                </li>
                <li className="category">
                  <span>
                    {movie.release_date
                      ? movie.release_date.split("-")[0]
                      : "N/A"}
                  </span>
                </li>
                {/* Nếu có thời lượng thì thêm dòng này */}
                {movie.runtime && (
                  <li className="time">
                    <span>
                      <i className="ri-time-line"></i>
                      {movie.runtime}
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <p className="desc">{movie.description}</p>
            {/* Nút Watch Now nếu bạn có link xem */}
            {movie.video_url && (
              <button
                className="btn watch-btn"
                onClick={() => window.open(`/video-player/${movie.video_url}`, "_blank")}
              >
                <i className="ri-play-fill"></i>
                Watch Now
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MovieDetails;
