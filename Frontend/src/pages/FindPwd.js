import React, { useState } from "react";
import axios from "axios"; // ✅ API 직접 호출
import ErrorModal from "../components/ErrorModal";
import "./FindPwd.css";
import { Link } from "react-router-dom";

function FindPwd() {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [newPassword, setNewPassword] = useState(""); // ✅ 새 비밀번호 입력 필드 추가
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFindPassword = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // ✅ API 직접 요청 보내기
      const response = await axios.post("http://localhost:3000/resetPwd", {
        user_name: userName.trim(),
        user_phone: userPhone.trim(),
        new_pwd: newPassword.trim(),
      });

      setMessage(response.data.message); // 성공 메시지 표시
    } catch (error) {
      console.error("🚨 비밀번호 찾기 오류:", error);

      if (error.response) {
        switch (error.response.status) {
          case 404:
            setError("사용자 정보가 일치하지 않습니다.");
            break;
          case 500:
            setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            break;
          default:
            setError(error.response.data?.message || "알 수 없는 오류가 발생했습니다.");
        }
      } else if (error.request) {
        setError("서버 응답이 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        setError("비밀번호 찾기 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findpwd-container">
      <div className="findpwd-box">
        <h2 className="findpwd-title">비밀번호 찾기</h2>

        {/* 이름 입력 */}
        <input
          type="text"
          id="userName"
          placeholder="가입한 이름을 입력하세요"
          className="findpwd-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        {/* 연락처 입력 */}
        <input
          type="text"
          id="userPhone"
          placeholder="가입한 연락처를 입력하세요"
          className="findpwd-input"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />

        {/* 새 비밀번호 입력 (추가) */}
        <input
          type="password"
          id="newPassword"
          placeholder="새 비밀번호를 입력하세요"
          className="findpwd-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="findpwd-button" onClick={handleFindPassword} disabled={loading}>
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>

        {message && <p className="findpwd-result">{message}</p>}

        <div className="signup-links">
          <Link to="/FindId" className="link-item">아이디 찾기</Link> |
          <Link to="/FindPwd" className="link-item">비밀번호 찾기</Link> |
          <Link to="/Signup" className="link-item">회원가입</Link>
        </div>

        {error && <ErrorModal message={error} onClose={() => setError("")} />}
      </div>
    </div>
  );
}

export default FindPwd;
