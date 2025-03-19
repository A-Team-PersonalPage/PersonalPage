import React, { useState } from "react";
import axios from "axios";
import ErrorModal from "../components/ErrorModal";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom"; // useNavigate import 추가

function Signup() {
  const [formData, setFormData] = useState({
    user_email: "",
    user_name: "",
    user_pwd: "",
    user_phone: "",
  }); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();  // ✅ useNavigate 사용

  // signup 함수 정의
  const signup = async (formData) => {
    try {
      const response = await axios.post("http://localhost:5000/signup", formData);  // 실제 API 엔드포인트로 수정
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await signup(formData);
      alert(response.message || "회원가입 성공!");
      setFormData({ user_email: "", user_name: "", user_pwd: "", user_phone: "" }); // 입력 필드 초기화
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data?.message || "회원가입 실패");
      } else if (error.request) {
        setError("서버 응답이 없습니다. 백엔드가 실행 중인지 확인하세요.");
      } else {
        setError("회원가입 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">회원가입을 진행해주세요</h2>

        <div className="input-container">
          <input
            type="email"
            name="user_email"
            placeholder="이메일"
            className="email-input"
            value={formData.user_email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="user_name"
            placeholder="이름"
            className="name-input"
            value={formData.user_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="user_phone"
            placeholder="연락처"
            className="phone-input"
            value={formData.user_phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="user_pwd"
            placeholder="비밀번호"
            className="pwd-input"
            value={formData.user_pwd}
            onChange={handleChange}
          />
        </div>

        <button
          className="signup-main-button"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <div className="signup-links">
          <Link to="/FindId" className="link-item">
            아이디 찾기
          </Link>{" "}
          |{" "}
          <Link to="/FindPwd" className="link-item">
            비밀번호 찾기
          </Link>{" "}
          |{" "}
          <Link to="/login" className="link-item">
            로그인
          </Link>
        </div>

        {error && <ErrorModal message={error} onClose={() => setError("")} />}
      </div>
    </div>
  );
}

export default Signup;
