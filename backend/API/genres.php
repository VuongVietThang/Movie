<?php

header("Access-Control-Allow-Origin: *"); // Hoặc thay * bằng http://localhost:3000 nếu muốn giới hạn
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


require(__DIR__ . '/../Model/db.php');


$query = "SELECT * FROM genres";
$result = $conn->query($query);

$genres = [];
while ($row = $result->fetch_assoc()) {
    $genres[] = $row;
}

echo json_encode($genres);
?>

