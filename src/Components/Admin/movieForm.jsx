import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import "./admin.css";
import { CFormInput, CFormTextarea } from "@coreui/react";
import { MultiSelect } from "primereact/multiselect";



function MovieForm() {

  useEffect(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
  document.head.appendChild(link);

  return () => {
    document.head.removeChild(link);
  };
}, []);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genres, setGenres] = useState([]); // Danh sách thể loại từ backend
  const [selectedGenres, setSelectedGenres] = useState([]); // Danh sách object thể loại
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [video, setVideo] = useState(null);
  const [poster, setPoster] = useState(null);
  const [movieGenresId, setMovieGenresId] = useState([]); // Mảng id để xử lý edit

  

  const style = {
    section: {
      padding: "10px 0px"
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE = "http://localhost/Movie/backend/API";
  
 


  // Lấy danh sách thể loại
  useEffect(() => {
    axios
      .get(`${API_BASE}/genres.php`)
      .then((res) => setGenres(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách thể loại:", err));
  }, []);

  // Lấy thông tin phim nếu có id (edit)
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE}/get_movie.php?id=${id}`)
        .then((res) => {
          const movie = res.data;
          setTitle(movie.title);
          setAuthor(movie.author);
          setDescription(movie.description);
          setReleaseDate(movie.release_date);
          setPoster(movie.poster_url);
          setMovieGenresId(movie.genres_id); // Mảng ID
        })
        .catch((err) => console.error("Lỗi khi lấy thông tin phim:", err));
    }
  }, [id]);

  // Ghép genres_id và genres để tạo selectedGenres (ép kiểu id để tránh sai .includes)
  useEffect(() => {
    if (genres.length > 0 && movieGenresId.length > 0) {
      const matchedGenres = genres.filter((genre) =>
        movieGenresId.includes(Number(genre.id))
      );
      setSelectedGenres(matchedGenres);
    }
  }, [genres, movieGenresId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("release_date", releaseDate);

    selectedGenres.forEach((genre) => {
      formData.append("category[]", genre.id);
    });

    if (video) formData.append("video", video);
    if (poster) formData.append("poster", poster);

    const request = id
      ? axios.post(`${API_BASE}/update_movie.php?id=${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : axios.post(`${API_BASE}/add_movie.php`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then(() => navigate("/admin"))
      .catch((err) => console.error("Lỗi khi gửi dữ liệu:", err));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5">
      <div style={style.section}>
        <label className="block font-medium">Movie Title</label>
        <CFormInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Movie Title"
          required
        />
      </div>

      <div style={style.section}>
        <label className="block font-medium">Author</label>
        <CFormInput
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          type="text"
          placeholder="Author"
          required
        />
      </div>

      <div style={style.section}>
        <label className="block font-medium">Genres</label>
        <MultiSelect
          value={selectedGenres}
          onChange={(e) => setSelectedGenres(e.value)}
          options={genres}
          optionLabel="name"
          display="chip"
          placeholder="Select Genres"
          maxSelectedLabels={3}
          className="w-full"
          style={{
            width: "100%",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        />
      </div>

      <div style={style.section}>
        <label className="block font-medium">Description</label>
        <CFormTextarea
          className="mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
      </div>

      <div style={style.section}>
        <label className="block font-medium">Ngày xuất bản</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="border w-full px-2 py-1"
          required
        />
      </div>

      <div style={style.section}>
        <label className="block font-medium">Tải ảnh poster</label>
        <input
          type="file"
          onChange={(e) => setPoster(e.target.files[0])}
          className="border w-full px-2 py-1"
          required={!id}
        />
      </div>

      <div style={style.section}>
        <label className="block font-medium">Tải video lên</label>
        <input
          type="file"
          onChange={(e) => setVideo(e.target.files[0])}
          className="border w-full px-2 py-1"
          required={!id}
        />
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 button rounded"
        type="submit"
      >
        {id ? "Cập nhật" : "Thêm"}
      </button>
    </form>
  );
}

export default MovieForm;
