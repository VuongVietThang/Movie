<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require(__DIR__ . '/../Model/db.php');

$genreFilter = isset($_GET['genre']) ? (int)$_GET['genre'] : 0;

$sql = "SELECT 
          m.id AS movie_id, m.title, m.release_date,
          m.author, m.description, m.poster_url,
          GROUP_CONCAT(g.id) AS genre_ids,
          GROUP_CONCAT(g.name) AS genre_names
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id";

$params = [];
$types = "";

if ($genreFilter > 0) {
    $sql .= " WHERE m.id IN (
      SELECT movie_id FROM movie_genres WHERE genre_id = ?
    )";
    $params[] = $genreFilter;
    $types .= "i";
}

$sql .= " GROUP BY m.id ORDER BY m.id";

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
    $genres = [];
    if ($row['genre_ids']) {
        $ids = explode(',', $row['genre_ids']);
        $names = explode(',', $row['genre_names']);
        foreach ($ids as $k => $id) {
            $genres[] = ['id' => (int)$id, 'name' => $names[$k]];
        }
    }

    $movies[] = [
        'id' => $row['movie_id'],
        'title' => $row['title'],
        'author' => $row['author'],
        'description' => $row['description'],
        'release_date' => $row['release_date'],
        'poster_url' => $row['poster_url'],
        'genres' => $genres,
    ];
}

header('Content-Type: application/json');
echo json_encode($movies);
