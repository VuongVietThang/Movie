import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeBanner from "../Components/HomeBanner";
import Subscribe from "../Components/Subscribe";
import TopMovies from "../Components/TopMovies";

const Home = ({setWatchList, watchList}) => {
  const [filterCtg, setFilterCtg] = useState("Action");
  const [topMovies, setTopMovies] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(`https://omdbapi.com/?apikey=7b85d604&s=${filterCtg}`, {
      signal: signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setTopMovies(data.Search.slice(0, 8));
      });

    return () => {
      controller.abort();
    };
  }, [filterCtg]);

  // Scroll khi location.state.scrollTo tồn tại
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        section?.scrollIntoView({ behavior: "smooth" });
      }, 100); // delay để chắc chắn phần tử đã render
    }
  }, [location]);

  return (
    <>
      <HomeBanner />
      {/* Thêm id="movies" cho phần TopMovies */}
      <div id="movies">
        <TopMovies
          filterCtg={filterCtg} setFilterCtg={setFilterCtg} topMovies={topMovies} setWatchList={setWatchList} watchList={watchList}
        />
      </div>

      {/* Thêm id="subscribe" cho phần Subscribe */}
      <div id="subscribe">
        <Subscribe /> 
      </div>
    </>
  );
};

export default Home;
