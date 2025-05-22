<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require(__DIR__ . '/../Model/db.php'); // kết nối database

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid movie id']);
    exit;
}

$sql = "SELECT 
          m.id AS movie_id, m.title, m.release_date,
          m.author, m.description, m.poster_url,m.video_url,
          GROUP_CONCAT(g.id) AS genre_ids,
          GROUP_CONCAT(g.name) AS genre_names
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        WHERE m.id = ?
        GROUP BY m.id";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $genres = [];
    if ($row['genre_ids']) {
        $ids = explode(',', $row['genre_ids']);
        $names = explode(',', $row['genre_names']);
        foreach ($ids as $k => $genreId) {
            $genres[] = ['id' => (int)$genreId, 'name' => $names[$k]];
        }
    }

    $movie = [
        'id' => $row['movie_id'],
        'title' => $row['title'],
        'author' => $row['author'],
        'description' => $row['description'],
        'release_date' => $row['release_date'],
        'poster_url' => $row['poster_url'],
        'video_url' => $row['video_url'],
        'genres' => $genres,
    ];

    header('Content-Type: application/json');
    echo json_encode($movie);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Movie not found']);
}
