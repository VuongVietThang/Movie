import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import { CButton } from "@coreui/react";
import {
  CTable,
  CTableHeaderCell,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableDataCell,
} from "@coreui/react";
import axios from "axios";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const navigate = useNavigate();

  const API_BASE = "http://localhost/Movie/backend/API";

  const fetchMovies = () => {
    const url = selectedGenre
      ? `${API_BASE}/movies.php?genre=${selectedGenre}`
      : `${API_BASE}/movies.php`;

    axios
      .get(url)
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err));
  };

  const fetchGenres = () => {
    axios
      .get(`${API_BASE}/genres.php`)
      .then((res) => setGenres(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, [fetchMovies]);
  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xoá?")) {
      axios
        .delete(`${API_BASE}/delete_movie.php?id=${id}`)
        .then(() => fetchMovies())
        .catch((err) => console.error(err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };
  const handleAdd = () => {
    navigate("/admin/add");
  };

  return (
    <div>
      <div className="action flex justify-between mb-4">
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 roundeds"
        >
          ADD FILM
        </button>

        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          LOGOUT
        </button>
        <select
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border-radius-10 p-2 select"
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <CTable
        bordered
        hover
        responsive
        align="middle"
        className="table-admin mb-0"
      >
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Tên phim</CTableHeaderCell>
            <CTableHeaderCell>Tác giả</CTableHeaderCell>
            <CTableHeaderCell>Mô tả</CTableHeaderCell>
            <CTableHeaderCell>Thể loại</CTableHeaderCell>
            <CTableHeaderCell>Ngày chiếu</CTableHeaderCell>
            <CTableHeaderCell>Poster</CTableHeaderCell>
            <CTableHeaderCell>Chức năng</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {movies.map((movie) => (
            <CTableRow key={movie.id}>
              <CTableDataCell>{movie.id}</CTableDataCell>
              <CTableDataCell>{movie.title}</CTableDataCell>
              <CTableDataCell>{movie.author}</CTableDataCell>
              <CTableDataCell>{movie.description}</CTableDataCell>
              <CTableDataCell>
                {movie.genres?.map((genre) => genre.name).join(", ")}
              </CTableDataCell>
              <CTableDataCell>{movie.release_date}</CTableDataCell>
              <CTableDataCell>
                {movie.poster_url ? (
                  <img
                    src={`http://localhost/Movie/backend/Image/${movie.poster_url}`}
                    alt={movie.title}
                    width="150"
                  />
                ) : (
                  "Không có hình ảnh"
                )}
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="info"
                  variant="outline"
                  onClick={() => navigate(`/admin/edit/${movie.id}`)}
                >
                  Edit
                </CButton>
                <CButton
                  onClick={() => handleDelete(movie.id)}
                  color="danger"
                  variant="outline"
                >
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
}

export default MovieList;
