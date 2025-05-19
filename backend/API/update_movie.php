<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require(__DIR__ . '/../Model/db.php');

$movie_id = $_GET['id'] ?? 0;

// Lấy thông tin hiện tại
$query = "SELECT * FROM movies WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $movie_id);
$stmt->execute();
$result = $stmt->get_result();
$movie = $result->fetch_assoc();

if (!$movie) {
    echo json_encode(["error" => "Không tìm thấy phim"]);
    exit;
}

// Lấy dữ liệu gửi lên (hoặc dùng dữ liệu cũ)
$title = $_POST['title'] ?? $movie['title'];
$release_date = $_POST['release_date'] ?? $movie['release_date'];
$author = $_POST['author'] ?? $movie['author'];
$description = $_POST['description'] ?? $movie['description'];

// Cập nhật thông tin cơ bản
$query = "UPDATE movies SET title = ?, release_date = ?, author = ?, description = ? WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssssi", $title, $release_date, $author, $description, $movie_id);
$stmt->execute();

// Cập nhật thể loại nếu có
if (isset($_POST['category']) && is_array($_POST['category'])) {
    $genres = $_POST['category'];

    // Xoá thể loại cũ
    $query = "DELETE FROM movie_genres WHERE movie_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $movie_id);
    $stmt->execute();

    // Thêm thể loại mới
    foreach ($genres as $genre_id) {
        $query = "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $movie_id, $genre_id);
        $stmt->execute();
    }
}

// Cập nhật video nếu có file upload
if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
    $video_name = uniqid() . "_" . basename($_FILES['video']['name']);
    $video_tmp = $_FILES['video']['tmp_name'];
    move_uploaded_file($video_tmp, __DIR__ . '/../Video/' . $video_name);

    $query = "UPDATE movies SET video_url = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $video_name, $movie_id);
    $stmt->execute();
}

// ✅ Cập nhật poster nếu có file upload
if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
    $poster_name = uniqid() . "_" . basename($_FILES['poster']['name']);
    $poster_tmp = $_FILES['poster']['tmp_name'];
    move_uploaded_file($poster_tmp, __DIR__ . '/../Poster/' . $poster_name);

    $query = "UPDATE movies SET poster = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $poster_name, $movie_id);
    $stmt->execute();
}

echo json_encode(["message" => "Cập nhật thành công"]);
