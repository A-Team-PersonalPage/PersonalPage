import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 로그인 상태 전역 관리
import Layout from "./components/Layout";
import Main from "./pages/Main/Main"; // 메인 페이지 추가
import Login from "./pages/Login"; // 로그인 페이지 추가
import Signup from './pages/Signup'; // 회원가입 페이지 추가 (오타 수정됨)
import FindId from "./pages/FindId"; // 아이디 찾기 페이지 추가
import FindPwd from "./pages/FindPwd"; // 비밀번호 찾기 페이지 추가
import Introduce from "./pages/Introduce"; // 소개글 페이지 추가
import MyPage from './pages/MyPage/MyPage';  // 중복 import 제거
import MyPageEdit from './pages/MyPage/MyPageEdit';  // 중복 import 제거
import Search from "./pages/Search/Search";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes> {/* 모든 페이지에 헤더&푸터 설정 */}
            <Route path="/" element={<Main />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/FindId" element={<FindId />} />
            <Route path="/FindPwd" element={<FindPwd />} />
            <Route path="/place/:place_name" element={<Introduce />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/myPage/edit" element={<MyPageEdit />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Layout>  
      </Router>
    </AuthProvider>
  );
}

export default App;
