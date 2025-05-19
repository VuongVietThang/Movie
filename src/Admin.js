import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MovieList from "./Components/Admin/movieLists";
import MovieForm from "./Components/Admin/movieForm";
// import LoginForm from "./LoginForm";

function AdminLayout() {
  // Tùy ý kiểm tra token ở đây nếu cần
  const isLoggedIn = localStorage.getItem("admin_token") === "valid";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Movie Manager</h1>

      <Routes>
        {/* Trang đăng nhập */}
        {/* <Route path="/login" element={<LoginForm />} /> */}

        {/* Nếu chưa login thì chuyển hướng tất cả route khác về /admin/login */}
        {/* {!isLoggedIn ? (
          <Route path="*" element={<Navigate to="/admin/login" />} />
        ) : (
          <>
            <Route path="/" element={<MovieList />} />
            <Route path="/add" element={<MovieForm />} />
            <Route path="/edit/:id" element={<MovieForm />} />
          </>
        )} */}
        <Route path="/admin" element={<MovieList />} />
        <Route path="/admin/add" element={<MovieForm />} />
        <Route path="/admin/edit/:id" element={<MovieForm />} />
        <Route path="/admin/delete/:id" element={<MovieForm />} />
      </Routes>
    </div>
  );
}

export default AdminLayout;
