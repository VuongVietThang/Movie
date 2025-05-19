<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require(__DIR__ . '/../Model/db.php');

$title = $_POST['title'] ?? '';
$author = $_POST['author'] ?? '';
$description = $_POST['description'] ?? '';
$release_date = $_POST['release_date'] ?? '';
$genres = $_POST['category'] ?? []; // Mảng category[] nếu gửi đúng cách từ JS
$videoName = null;
$poster = null;

// Đảm bảo category là mảng (phòng trường hợp JS gửi sai)
if (!is_array($genres)) {
    $genres = [];
}

// Xử lý file video upload
if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
    $videoTmp = $_FILES['video']['tmp_name'];
    $videoName = uniqid() . "_" . basename($_FILES['video']['name']);
    move_uploaded_file($videoTmp, __DIR__ . '/../Video/' . $videoName);
}

// Xử lý file poster upload
if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
    $posterTmp = $_FILES['poster']['tmp_name'];
    $poster = uniqid() . "_" . basename($_FILES['poster']['name']);
    move_uploaded_file($posterTmp, __DIR__ . '/../Image/' . $poster); // Thư mục lưu ảnh poster
}


// Thêm phim vào bảng `movies`
$query = "INSERT INTO movies (title, author, description, release_date, poster_url, video_url) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssssss", $title, $author, $description, $release_date, $poster, $videoName);
$stmt->execute();


$movie_id = $stmt->insert_id;

// Thêm thể loại vào bảng `movie_genres`
if (!empty($genres)) {
    $stmt = $conn->prepare("INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)");
    foreach ($genres as $genre_id) {
        $stmt->bind_param("ii", $movie_id, $genre_id);
        $stmt->execute();
    }
}

echo json_encode(["message" => "Thêm phim thành công"]);
