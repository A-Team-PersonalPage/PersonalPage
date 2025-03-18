import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main/Main"; // 메인 페이지 추가
import Login from "./pages/Login"; // 로그인 페이지 추가
import Signup from './pages/Signup'; //회원가입 페이지 추가
import FindId from "./pages/FindId"; //아이디 찾기 페이지 추가
import FindPwd from "./pages/FindPwd"; //비밀먼호 찾기 페이지 추가
import Introduce from "./pages/Introduce"; //소개글 페이지 추가
import MyPage from "./pages/MyPage/MyPage";
import MyPageEdit from "./pages/MyPage/MyPageEdit";

function App() {
  return (
    <Router>
      <Layout>
        <Routes> {/* 모든 페이지에 헤더&푸터 설정 */}
          <Route path="/" element={<Main />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/FindId" element={<FindId />} />
          <Route path="/FindPwd" element={<FindPwd />} />
          <Route path="/Introduce" element={<Introduce />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/myPage/edit" element={<MyPageEdit />} />
        </Routes>
      </Layout>  
    </Router>
  );
}

export default App;
