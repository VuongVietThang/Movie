import React, { useState, useEffect } from "react"; // Thêm useEffect
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import SearchPage from "./Pages/SearchPage";
import SingleMovie from "./Pages/SingleMovie";
import Search from "./Components/Search";
import Favourites from "./Pages/Favourites";
import AdminLayout from "./Pages/Admin";
import VideoPlayer from "./Components/VideoPlayer";

function VideoPlayerWrapper() {
  const { videoUrl } = useParams();
  const decodedVideoUrl = decodeURIComponent(videoUrl);
  return <VideoPlayer videoUrl={decodedVideoUrl} />;
}

function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [watchList, setWatchList] = useState(
    JSON.parse(localStorage.getItem("watchList")) || []
  );

  // ✅ Tự động lưu vào localStorage mỗi khi watchList thay đổi
  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }, [watchList]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public layout */}
        <Route
          path="/*"
          element={
            <>
              <Navbar setShowSearch={setShowSearch} watchList={watchList} />
              <Search
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                setCurrentPage={setCurrentPage}
              />
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      setWatchList={setWatchList}
                      watchList={watchList}
                    />
                  }
                />
                <Route
                  path="/search/:query"
                  element={
                    <SearchPage
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      setWatchList={setWatchList}
                      watchList={watchList}
                    />
                  }
                />
                <Route path="/movie/:id" element={<SingleMovie />} />
                <Route
                  path="/favourites"
                  element={
                    <Favourites
                      watchList={watchList}
                      setWatchList={setWatchList}
                    />
                  }
                />
                <Route path="/video-player/:videoUrl" element={<VideoPlayerWrapper />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Admin layout */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
