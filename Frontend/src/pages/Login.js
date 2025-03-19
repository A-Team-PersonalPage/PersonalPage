import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { user_email: email, user_pwd: password },
        { withCredentials: true }
      );

      console.log("서버 응답:", response.data); // 디버깅 로그

      if (response.data.user_name) {
        alert(`${response.data.user_name}님 환영합니다.`);

        // ✅ 로그인 성공 후 localhost:3000로 이동
        window.location.href = "http://localhost:5000";
      } else {
        setError("로그인 실패: 사용자 정보를 가져올 수 없습니다.");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError(err.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-main-button">
            로그인
          </button>
        </form>
        <div className="login-links">
          <a href="/find-id">아이디 찾기</a> | <a href="/find-password">비밀번호 찾기</a> | <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
