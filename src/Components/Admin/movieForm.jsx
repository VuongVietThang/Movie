import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { CFormInput, CFormTextarea } from "@coreui/react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-cyan/theme.css";

function MovieForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genres, setGenres] = useState([]); // Lưu danh sách thể loại từ backend
  const [selectedGenres, setSelectedGenres] = useState([]); // Lưu các thể loại được chọn
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [video, setVideo] = useState(null); // Trạng thái lưu video
  const [poster, setPoster] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE = "http://localhost/Movie-react/backend/API";

  // Load genres từ backend (API)
  useEffect(() => {
    axios
      .get(`${API_BASE}/genres.php`)
      .then((res) => setGenres(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách thể loại:", err));
  }, []);

  // Nếu có id thì load thông tin phim
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
          setSelectedGenres(movie.genres_id); // genres_id sẽ là mảng
        })
        .catch((err) => console.error("Lỗi khi lấy thông tin phim:", err));
    }
  }, [id]);

  // Hàm xử lý gửi dữ liệu lên backend
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

    // Nếu có video, append vào FormData
    if (video) {
      formData.append("video", video);
    }
    if (poster) {
      formData.append("poster", poster);
    }

    // Tạo request tùy thuộc vào việc có id hay không (thêm hay cập nhật)
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

  // Hàm xử lý thay đổi thể loại
  // const handleGenreChange = (e) => {
  //   const selectedOptions = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );
  //   setSelectedGenres(selectedOptions);
  // };

  //   const handleGenreChange = (e) => {
  //   setSelectedGenres(e.value);
  // };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5">
      <div>
        <label className="block font-medium">Movie Title</label>
        <CFormInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Movie Title"
          aria-label="default input example"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Author</label>
        <CFormInput
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          type="text"
          placeholder="Author"
          aria-label="default input example"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Genres</label>
        {/* <select
          multiple
          value={selectedGenres}
          onChange={handleGenreChange}
          className="border w-full px-2 py-1"
          required
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select> */}

        <MultiSelect
          value={selectedGenres}
          onChange={(e) => setSelectedGenres(e.value)}
          options={genres}
          optionLabel="name"
          display="chip"
          placeholder="Select Genres"
          maxSelectedLabels={3}
          className="w-full md:w-20rem"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        {/* <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full px-2 py-1"
          rows={4}
        ></textarea> */}
        <CFormTextarea
          className="mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          aria-label="Disabled textarea example"
          required
        ></CFormTextarea>
      </div>

      <div>
        <label className="block font-medium">Ngày xuất bản</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="border w-full px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Tải ảnh poster</label>
        <input
          type="file"
          onChange={(e) => setPoster(e.target.files[0])}
          className="border w-full px-2 py-1"
          required
        />

        {id && typeof poster === "string" && (
          <p className="text-sm text-gray-600 mt-1">
            Poster hiện tại: <span className="italic">{poster}</span>
          </p>
        )}
      </div>

      {/* Input file để tải video */}
      <div>
        <label className="block font-medium">Tải video lên</label>
        <input
          type="file"
          onChange={(e) => setVideo(e.target.files[0])}
          className="border w-full px-2 py-1"
          required
        />
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        type="submit"
      >
        {id ? "Cập nhật" : "Thêm"}
      </button>
    </form>
  );
}

export default MovieForm;
