<?php
$servername = "localhost"; // Tên máy chủ, có thể là "localhost"
$username = "root"; // Tên đăng nhập MySQL (mặc định là root)
$password = ""; // Mật khẩu MySQL (mặc định là rỗng nếu chưa thay đổi)
$dbname = "movie"; // Tên cơ sở dữ liệu của bạn

// Tạo kết nối
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>
