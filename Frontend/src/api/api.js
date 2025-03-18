import axios from "axios";

//환경변수에서 API 주소 가져오기
const API_BASE_URL = process.env.REACT_APP_API_URL || `http://localhost:포트번호`;

// 백엔드 실행 여부 확인 함수
const checkBackend = async () => {
  try {
    await axios.get(`${API_BASE_URL}/health-check`);
    return true; // 백엔드 실행 중
  } catch (error) {
    console.warn(" 백엔드가 실행되지 않음. Mock 데이터로 테스트 진행.");
    return false; // 백엔드 실행 안됨
  }
};

//로그인 API 요청
export const login = async ({ user_email, user_pwd }) => {
  const backendAvailable = await checkBackend();

  if (!backendAvailable) {
    console.log(" [MOCK] 로그인 성공 (백엔드 없이 테스트)");
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          token: "mock_token_1234",
          user: { user_email, user_name: "테스트 유저" },
        });
      }, 1000)
    );
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      user_email,
      user_pwd,
    });

    console.log(" 로그인 응답:", response.data);

    //로그인 성공 시 토큰 저장
    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error) {
    console.error("로그인 오류:", error.response?.data || error.message);
    throw error;
  }
};

//인증이 필요한 API 요청 (헤더에 토큰 포함)
export const fetchProtectedData = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${API_BASE_URL}/protected-route`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("인증된 요청 실패:", error.response?.data || error.message);
    throw error;
  }
};

//아이디 찾기 API (백엔드 없으면 Mock 데이터 반환)
export const findId = async ({ user_name, user_phone }) => {
  const backendAvailable = await checkBackend();

  if (!backendAvailable) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          user_email: "mock_email@example.com",
        });
      }, 1000)
    );
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/find-id`, {
      user_name,
      user_phone,
    });
    return response.data;
  } catch (error) {
    console.error("아이디 찾기 오류:", error.response?.data || error.message);
    throw error;
  }
};

//비밀번호 찾기 API (백엔드 없으면 Mock 데이터 반환)
export const findPassword = async ({ user_email, user_name, user_phone }) => {
  const backendAvailable = await checkBackend();

  if (!backendAvailable) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ message: "비밀번호 재설정 이메일이 전송되었습니다." });
      }, 1000)
    );
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/find-password`, {
      user_email,
      user_name,
      user_phone,
    });
    return response.data;
  } catch (error) {
    console.error("비밀번호 찾기 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 회원가입 API (백엔드 없으면 Mock 데이터 반환)
export const signup = async ({ user_email, user_name, user_pwd, user_phone }) => {
  const backendAvailable = await checkBackend();

  if (!backendAvailable) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ message: "회원가입 성공!" });
      }, 1000)
    );
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      user_email,
      user_name,
      user_pwd,
      user_phone,
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 오류:", error.response?.data || error.message);
    throw error;
  }
};