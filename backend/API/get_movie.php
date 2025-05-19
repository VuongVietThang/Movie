<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require(__DIR__ . '/../Model/db.php');

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "Thiếu ID phim"]);
    exit;
}

$movie_id = intval($_GET['id']);

// Lấy thông tin phim
$query = "SELECT * FROM movies WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $movie_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Không tìm thấy phim"]);
    exit;
}

$movie = $result->fetch_assoc();

// Lấy danh sách ID thể loại của phim này
$genre_query = "SELECT genre_id FROM movie_genres WHERE movie_id = ?";
$stmt = $conn->prepare($genre_query);
$stmt->bind_param("i", $movie_id);
$stmt->execute();
$genre_result = $stmt->get_result();

$genres_id = [];
while ($row = $genre_result->fetch_assoc()) {
    $genres_id[] = $row['genre_id'];
}

// Gộp vào kết quả trả về
$movie['genres_id'] = $genres_id;

echo json_encode($movie);
?>
