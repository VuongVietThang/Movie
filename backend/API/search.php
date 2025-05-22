<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require(__DIR__ . '/../Model/db.php');
$query = $_GET['query'] ?? '';
if (empty(trim($query))) {
  echo json_encode(['error' => 'Thiếu từ khóa tìm kiếm']);
  exit;
}

$keyword = "%$query%";

// Truy vấn: tìm trong title, author, description, và tên thể loại
$sql = "
    SELECT DISTINCT m.*
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.title LIKE ?
       OR m.author LIKE ?
       OR m.description LIKE ?
       OR g.name LIKE ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $keyword, $keyword, $keyword, $keyword);
$stmt->execute();

$result = $stmt->get_result();
$movies = [];

while ($row = $result->fetch_assoc()) {
    $movies[] = $row;
}

header('Content-Type: application/json');
echo json_encode($movies);
?>
