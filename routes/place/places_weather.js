const express = require('express');
const axios = require('axios');
const db = require('../../db');
const router = express.Router();

// 특정 장소 조회 (도시명으로 위도/경도 찾기)
router.get('/:place_name', async (req, res) => {
  const { place_name } = req.params;
  const decodedPlaceName = decodeURIComponent(place_name); // 한글 디코딩

  console.log(`요청된 도시 이름: ${decodedPlaceName}`);

  // DB에서 도시명 가져오기
  db.query('SELECT * FROM places WHERE place_name = ?', [decodedPlaceName], async (err, result) => {
    if (err) {
      console.error("DB 조회 오류:", err);
      return res.status(500).send({ message: '서버 오류 (DB 조회 실패)' });
    }

    console.log(`'${decodedPlaceName}'에 대한 DB 조회 결과:`, result);

    if (result.length === 0) { 
      console.warn(`'${decodedPlaceName}'에 대한 정보 없음! Geonames API에서 가져옵니다.`);

      try {
        // Geonames API에서 도시 정보 가져오기
        const geoResponse = await axios.get(`http://api.geonames.org/searchJSON`, {
          params: {
            q: decodedPlaceName,
            username: process.env.GEONAME_USERNAME,
            maxRows: 1,
            restype: "json"
          }
        });

        const placeData = geoResponse.data.geonames[0];
        if (!placeData) {
          console.warn(`'${decodedPlaceName}'을(를) Geonames에서 찾을 수 없음.`);
          return res.status(404).send({ message: '도시를 찾을 수 없습니다.' });
        }

        // 새 장소를 DB에 추가
        const place_lat = parseFloat(placeData.lat);
        const place_lon = parseFloat(placeData.lng);
        const geo_id = placeData.geonameId;

        db.query(
          'INSERT INTO places (geo_id, place_name, place_lat, place_lon) VALUES (?, ?, ?, ?)',
          [geo_id, decodedPlaceName, place_lat, place_lon],
          (insertErr) => {
            if (insertErr) {
              console.error("장소 추가 실패:", insertErr);
              return res.status(500).send({ message: 'DB에 장소 추가 실패' });
            }
            console.log(`'${decodedPlaceName}' DB에 추가 완료`);
          }
        );

        result = [{ place_lat, place_lon }];
      } catch (geoError) {
        console.error("Geonames API 요청 실패:", geoError);
        return res.status(500).send({ message: 'Geonames API 호출 실패' });
      }
    }

    const { place_lat, place_lon } = result[0];

    try {
      //Open-Meteo API 요청 수정: 더 많은 날씨 데이터 요청
      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
        params: {
          latitude: place_lat,
          longitude: place_lon,
          current: "temperature_2m,windspeed_10m,cloudcover,relative_humidity_2m",  //데이터 추가
        }
      });

      console.log("날씨 정보 응답 데이터:", weatherResponse.data.current); // 로그 확인

      // 날씨와 위치 정보 반환
      res.json({
        city: decodedPlaceName,
        place_lat,
        place_lon,
        weather: {
          temperature: weatherResponse.data.current.temperature_2m,  //온도
          windspeed: weatherResponse.data.current.windspeed_10m,    //바람 속도
          cloudcover: weatherResponse.data.current.cloudcover,      //구름량
          humidity: weatherResponse.data.current.relative_humidity_2m, //습도
        }
      });

    } catch (weatherError) {
      console.error("날씨 정보 가져오기 실패:", weatherError);
      res.status(500).send({ message: '위치 정보나 날씨 정보를 가져오는 데 실패했습니다.' });
    }
  });
});

module.exports = router;
