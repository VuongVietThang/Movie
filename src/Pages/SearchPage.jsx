import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../Components/MovieCard';
import SubBanner from '../Components/SubBanner';
import NoData from '../Components/Search/noData';
import Subscribe from '../Components/Subscribe';
import Pagination from '../Components/Pagination';

const SearchPage = () => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
  const controller = new AbortController();
  
  fetch(`http://localhost/Movie/backend/API/search.php?query=${query}&page=${currentPage}`)

    .then((res) => res.json())
    .then((data) => {
  console.log('Dữ liệu trả về:', data);
  if (Array.isArray(data)) {
    // Backend trả thẳng mảng phim
    setTotalPages(1);
    setSearchResults(data);
  } else {
    // Backend trả object có cấu trúc {total_pages, movies}
    setTotalPages(data.total_pages || 1);
    setSearchResults(data.movies || []);
  }
})

    .catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tìm kiếm:', err);
      }
    });

  return () => controller.abort();
}, [query, currentPage]);


  return (
    <>
      <SubBanner title={'Search Results'} pathName={'Search'} />
      <section className='results-sec'>
        <div className='container'>
          <div className='section-title'>
            <h5 className='sub-title'>ONLINE STREAMING</h5>
            <h2 className='title'>{query}'s Related Results</h2>
          </div>
          <div className='row movies-grid'>
            {searchResults.length ? (
              searchResults.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))
            ) : (
              <NoData />
            )}
          </div>
          {
            totalPages > 1 &&
            (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )
          }
        </div>
      </section>
      <Subscribe />
    </>
  );
};

export default SearchPage;