// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  // 페이지가 로드될 때, localStorage에서 로그인 상태와 사용자 정보를 불러옴
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsLogin = localStorage.getItem('isLogin');

    if (storedUser && storedIsLogin === 'true') {
      setUser(JSON.parse(storedUser));
      setIsLogin(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/login',
        { user_email: email, user_pwd: password },
        { withCredentials: true }
      );

      if (response.data.user_name) {
        setIsLogin(true);
        setUser(response.data); // 로그인한 사용자 정보 저장

        // 로그인 정보를 localStorage에 저장
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('user', JSON.stringify(response.data));

        return response.data;
      } else {
        return false;
      }
    } catch (err) {
      console.error('로그인 실패:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsLogin(false);
      setUser(null); // 로그아웃 시 상태 초기화

      // localStorage에서 로그인 정보 삭제
      localStorage.removeItem('isLogin');
      localStorage.removeItem('user');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};