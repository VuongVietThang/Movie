import { Routes, Route } from "react-router-dom";
import MovieList from "../Components/Admin/movieLists";
import MovieForm from "../Components/Admin/movieForm";

function AdminLayout() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Movie Manager</h1>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="add" element={<MovieForm />} />
        <Route path="edit/:id" element={<MovieForm />} />
      </Routes>
    </div>
  );
}

export default AdminLayout;
