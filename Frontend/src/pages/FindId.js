import React, { useState } from "react";
import axios from "axios"; 
import ErrorModal from "../components/ErrorModal";
import "./FindId.css";
import { Link } from "react-router-dom";

function FindId() {
  const [userName, setUserName] = useState(""); // 이름 상태
  const [userPhone, setUserPhone] = useState(""); // 연락처 상태
  const [foundId, setFoundId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleFindId = async () => {
    setError("");
    setFoundId("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/findId", {
        user_name: userName.trim(),
        user_phone: userPhone.trim(),
      });

      if (response?.data?.user_email) {
        setFoundId(response.data.user_email);
      } else {
        setError("아이디를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("🚨 아이디 찾기 오류:", error);

      if (error.response) {
        switch (error.response.status) {
          case 404:
            setError("아이디와 연락처를 다시 확인해주세요.");
            break;
          case 500:
            setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            break;
          default:
            setError(
              error.response.data?.message || "알 수 없는 오류가 발생했습니다."
            );
        }
      } else if (error.request) {
        setError("서버 응답이 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        setError("아이디 찾기 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findid-container">
      <div className="findid-box">
        <h2 className="findid-title">아이디 찾기</h2>

        <input
          type="text"
          id="userName"
          name="userName"
          placeholder="가입한 이름을 입력하세요"
          className="findid-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="text"
          id="userPhone"
          name="userPhone"
          placeholder="가입한 연락처를 입력하세요"
          className="findid-input"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />

        <button
          className="findid-button"
          onClick={handleFindId}
          disabled={loading}
        >
          {loading ? "찾는 중..." : "아이디 찾기"}
        </button>

        {foundId && <p className="findid-result">당신의 아이디: {foundId}</p>}

        <div className="FindId-links">
          <Link to="/FindId" className="link-item">아이디 찾기</Link> |  
          <Link to="/FindPwd" className="link-item">비밀번호 찾기</Link> |  
          <Link to="/Signup" className="link-item">회원가입</Link>
        </div>

        {error && <ErrorModal message={error} onClose={() => setError("")} />}
      </div>
    </div>
  );
}

export default FindId;
