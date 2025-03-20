import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Introduce.css";

const Introduce = () => {
  const navigate = useNavigate();

  const { place_name } = useParams();
  const { isLogin } = useAuth();
  const [place, setPlace] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [likedPlaces, setLikedPlaces] = useState([]); // 좋아요한 목록 저장
  const [error, setError] = useState("");

  const user_id = 1; // 임시 유저 (실제로는 Context, localStorage에서 가져오기)

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const encodedPlaceName = encodeURIComponent(place_name);
        const weatherResponse = axios.get(`http://localhost:3000/places_weather/${encodedPlaceName}`);
        const infoResponse = axios.get(`http://localhost:3000/search/place/${encodedPlaceName}`);

        let likedPlacesResponse = null;
        if (isLogin) {
          likedPlacesResponse = axios.get(`http://localhost:3000/mypage/favoriteplaces`, { withCredentials: true });
        }

        const responses = isLogin
        ? await Promise.all([weatherResponse, infoResponse, likedPlacesResponse])
        : await Promise.all([weatherResponse, infoResponse]);

        const [weatherData, infoData, likedData] = isLogin
          ? responses
          : [...responses, { data: [] }]; // 로그인 안 한 경우 likedData를 빈 배열로 설정

        if (Array.isArray(infoData.data.data) && infoData.data.data.length > 0) {
          setPlaceInfo(infoData.data.data[0]);
        } else {
          setPlaceInfo(null);
        }

        setPlace(weatherData.data);
        setLikedPlaces(likedData.data); // 내가 좋아요한 목록 저장
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError("도시 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPlaceData();
  }, [place_name, isLogin]);

  // 현재 여행지가 내가 좋아요한 리스트에 있는지 체크
  const isLiked = likedPlaces.some(place => place.geo_id === placeInfo?.geo_id);

  const handleLikeToggle = async () => {
    const place_id = placeInfo.geo_id;

    try {
      if (!isLiked && isLogin) {
        // 좋아요 등록
        await axios.post(`http://localhost:3000/placelikes/${place_id}`, { user_id }, { withCredentials: true });
        setLikedPlaces((prev) => [...prev, { geo_id: place_id }]);
      } else if (!isLiked && !isLogin) {
        navigate('/login');
      } else {
        // 좋아요 취소
        await axios.delete(`http://localhost:3000/placelikes/${place_id}`, { data: { user_id }, withCredentials: true });
        setLikedPlaces((prev) => prev.filter((place) => place.geo_id !== place_id));
      }
    } catch (err) {
      console.error("좋아요 처리 중 오류 발생:", err);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!place || !placeInfo) return <p className="loading">로딩 중...</p>;

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="introduce-container">
          <h1>{placeInfo.place_name}</h1>

          <button className={`like-button ${isLiked ? "liked" : ""}`} onClick={handleLikeToggle}>
            {isLiked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
          </button>

          <div className="place-info">
            <h3>📍 여행지 소개</h3>
            <p>{placeInfo.place_info}</p>
          </div>

          <div className="weather-info">
            <h3>현재 날씨</h3>
            <p>🌡 온도: {place.weather.temperature}°C</p>
            <p>💨 바람 속도: {place.weather.windspeed} m/s</p>
            <p>☁️ 구름량: {place.weather.cloudcover} %</p>
            <p>💧 습도: {place.weather.humidity} %</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
