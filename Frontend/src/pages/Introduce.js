import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Introduce.css";

const Introduce = () => {
  const { place_name } = useParams();
  const [place, setPlace] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState("");
  const user_id = 1; // 임시 사용자 id

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const encodedPlaceName = encodeURIComponent(place_name);
        const weatherResponse = axios.get(`http://localhost:5000/places_weather/${encodedPlaceName}`);
        const infoResponse = axios.get(`http://localhost:5000/search/place/${encodedPlaceName}`);
        const [weatherData, infoData] = await Promise.all([weatherResponse, infoResponse]);

        if (Array.isArray(infoData.data.data) && infoData.data.data.length > 0) {
          const fetchedPlaceInfo = infoData.data.data[0];
          setPlaceInfo(fetchedPlaceInfo); // placeInfo 설정
          console.log("Fetched Place Info: ", fetchedPlaceInfo);  //
          await checkIfLiked(fetchedPlaceInfo.geo_id);
        } else {
          setPlaceInfo(null);
        }

        setPlace(weatherData.data);
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError("도시 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    const checkIfLiked = async (place_id) => {
      try {
        const res = await axios.get(`http://localhost:5000/placelikes/check/${place_id}/${user_id}`);
        setLiked(res.data.liked);
      } catch (err) {
        console.error("좋아요 상태 확인 중 오류 발생:", err);
      }
    };

    fetchPlaceData();
  }, [place_name]);

  const handleLikeToggle = async () => {
    const place_id = placeInfo.geo_id;

    try {
      if (!liked) {
        await axios.post(`http://localhost:5000/placelikes/${place_id}`, { user_id });
      } else {
        await axios.delete(`http://localhost:5000/placelikes/${place_id}`, { data: { user_id } });
      }
      setLiked(!liked);
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

          <button className={`like-button ${liked ? "liked" : ""}`} onClick={handleLikeToggle}>
            {liked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
          </button>

          {/* 장소 소개 표시 */}
          <div className="place-info">
            <h3>📍 여행지 소개</h3>
            <p>{placeInfo.place_info}</p> {/* 디비에서 가져온 place_info 값 표시 */}
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
