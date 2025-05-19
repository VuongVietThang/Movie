<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require(__DIR__ . '/../Model/db.php');

$genreFilter = isset($_GET['genre']) ? (int)$_GET['genre'] : 0;

$sql = "SELECT 
          m.id AS movie_id, m.title, m.release_date,
          m.author, m.description, m.poster_url,
          g.id AS genre_id, g.name AS genre_name
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id";

$params = [];
$types = "";

if ($genreFilter > 0) {
    $sql .= " WHERE g.id = ?";
    $params[] = $genreFilter;
    $types .= "i";
}

$sql .= " ORDER BY m.id";

if (!empty($params)) {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($sql);
}

$movies = [];

while ($row = $result->fetch_assoc()) {
    $id = $row['movie_id'];

    if (!isset($movies[$id])) {
        $movies[$id] = [
            'id' => $id,
            'title' => $row['title'],
            'author' => $row['author'],
            'description' => $row['description'],
            'release_date' => $row['release_date'],
            'poster_url' => $row['poster_url'],
            'genres' => []
        ];
    }

    if ($row['genre_id']) {
        $movies[$id]['genres'][] = [
            'id' => $row['genre_id'],
            'name' => $row['genre_name']
        ];
    }
}

header('Content-Type: application/json');
echo json_encode(array_values($movies));
