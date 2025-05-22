import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "./logo.png";
import "./style.css";

const Navbar = ({ setShowSearch, watchList }) => {
  const [sticky, setSticky] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const [showSide, setShowSide] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleResponsive = () => {
    if (window.innerWidth < 820) {
      setResponsive(true);
    } else {
      setResponsive(false);
    }
  };

  useEffect(() => {
    handleResponsive();
    window.addEventListener("resize", handleResponsive);
    return () => {
      window.removeEventListener("resize", handleResponsive);
    };
  });

  const handleScroll = () => {
    if (window.scrollY > 245) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    if (showSide) {
      document.body.style = "overflow: hidden";
    }

    return () => {
      document.body.style = "overflow: auto";
    };
  }, [showSide]);

  const handleShowSearch = () => {
    console.log("clicked");
    setShowSide(false);
    setShowSearch(true);
  };

  return (
    <nav className={sticky ? "navbar sticky" : "navbar"}>
      <div className="container">
        <div className="row">
          <div className="navbar-brand">
            <Link className="navbar-item link" to="/">
              <img src={logo} alt="Movflx" className="logo" />
            </Link>
          </div>
          <ul
            className={
              responsive
                ? showSide
                  ? "navbar-menu sidebar show"
                  : "navbar-menu sidebar"
                : "navbar-menu"
            }
          >
            {responsive ? (
              <button
                className="btn close-btn"
                onClick={() => setShowSide((prev) => false)}
              >
                <i className="ri-close-line"></i>
              </button>
            ) : null}
            <li className="navbar-item">
              <Link
                className="navbar-link"
                to="/"
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault(); // Chặn reload lại trang
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                Home
              </Link>
            </li>

            <li className="navbar-item">
              <button
                className="navbar-link"
                onClick={() => {
                  if (location.pathname === "/") {
                    // Nếu đang ở trang chủ thì cuộn luôn
                    const section = document.getElementById("movies");
                    section?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    // Nếu ở trang khác thì điều hướng về home và đợi rồi cuộn
                    navigate("/", { state: { scrollTo: "movies" } });
                  }
                }}
              >
                Movies
              </button>
            </li>

            <li className='navbar-item'>
              <Link className='navbar-link favourites' to='/favourites' onClick={() => setShowSide((prev) => false)}>
                Favourites
                {
                  watchList.length ? <span className='num'>{watchList.length}</span> : null
                }
              </Link>
            </li>

            <button
              className="navbar-link"
              onClick={() => {
                if (location.pathname === "/") {
                  // Nếu đang ở trang chính, cuộn thẳng
                  const section = document.getElementById("subscribe");
                  section?.scrollIntoView({ behavior: "smooth" });
                } else {
                  // Nếu đang ở trang khác, điều hướng về '/' và truyền state để cuộn
                  navigate("/", { state: { scrollTo: "subscribe" } });
                }
              }}
            >
              Subscribe
            </button>

            <li className="navbar-item">
              <button
                className="navbar-link btn"
                onClick={() => handleShowSearch()}
              >
                Search
              </button>
            </li>
          </ul>
          {responsive ? (
            <div className="right-btns">
              <button
                className="btn menu-toggle"
                onClick={() => setShowSide((prev) => true)}
              >
                <i className="ri-menu-3-line"></i>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
