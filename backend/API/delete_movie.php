<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require(__DIR__ . '/../Model/db.php');

if (!isset($_GET['id'])) {
    echo json_encode(["message" => "Thiếu ID"]);
    http_response_code(400);
    exit();
}

$movie_id = (int)$_GET['id'];

// Xoá bản ghi liên quan trong movie_genres trước (nếu có)
$conn->query("DELETE FROM movie_genres WHERE movie_id = $movie_id");

// Xoá phim trong bảng movies
$result = $conn->query("DELETE FROM movies WHERE id = $movie_id");

if ($result) {
    echo json_encode(["message" => "Xoá thành công"]);
} else {
    echo json_encode(["message" => "Xoá thất bại"]);
    http_response_code(500);
}
