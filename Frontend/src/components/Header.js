import React, { useState } from "react";
import "./Header.css";
import logo from '../assets/img/logo.svg';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { logout, isLogin, user } = useAuth();

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const logoutAction = async () => {
    await logout();
    hideDropdown();
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const hideDropdown = () => {
    setShowDropdown(false);
  };

  const handleMyPageClick = (e) => {
    e.stopPropagation();
    hideDropdown();
    navigate('/myPage');
  };
  
  return (
    <header className="header">
      <div className="header-container">
    
        <div className="logo" onClick={() => navigate("/")} style={{cursor: "pointer"}}>
          <img 
            src={logo} 
            alt="로고" 
          />
        </div>

        {/*검색창*/}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="검색" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/*네비게이션 메뉴*/}
        <nav className="nav-menu">
          <a href="#">살펴보기</a>
          <a href="#">인기</a>
          {isLogin ? 
            <>
            <a className="login_btn" onClick={toggleDropdown} onBlur={hideDropdown}>{user.user_name}님</a>
            {showDropdown && (
              <div className="dropdown">
                <a onClick={handleMyPageClick}>마이페이지</a>
                <a onClick={logoutAction}>로그아웃</a>
              </div>
            )} 
            </>
           : <a className="login_btn" href='/login'>로그인</a> 
          }
        </nav>
      </div>
    </header>
  );
}

export default Header;
