import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Main.css';
import { getImageForPlace } from '../../utils/imageUtils';
import toggle_abroad from '../../assets/img/toggle_abroad.svg';
import toggle_domestic from '../../assets/img/toggle_domestic.svg';
import ImgSlide from '../../components/ImgSlide/ImgSlide';
import like_active from '../../assets/img/ic_like_active.svg';
import like_unactive from '../../assets/img/ic_like_unactive.svg';

function Main() {
  const navigate = useNavigate();
  const { isLogin } = useAuth();
  
  const [isDomestic, setIsDomestic] = useState(true);
  const [allPlaces, setAllPlaces] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [userData, setUserData] = useState([]);
  const [likedPlaces, setLikedPlaces] = useState([]);

  // 국내 해외 토글
  const toggleLocation = () => {
    setIsDomestic(!isDomestic);
  };

  const toggle_location = isDomestic ? toggle_domestic : toggle_abroad;

  // API 호출
  useEffect(() => {    
    // 전체 장소 조회 API
    const fetchAllPlaces = axios.get(`http://localhost:3000/mainplace/korea`);

    // 인기 장소 조회 API
    const fetchPopularPlaces = axios.get(`http://localhost:3000/popular/place`);

    // 회원 정보 조회 API
    const fetchUserData = isLogin ?
     axios.get(`http://localhost:3000/mypage`, {
       withCredentials: true
      })
      : Promise.resolve({ data: {} });

    // 로그인한 경우 좋아요 여부 확인
    const fetchLikedPlaces = isLogin ? 
      axios.get(`http://localhost:3000/mypage/favoriteplaces`, {
        withCredentials: true
      })
      : Promise.resolve({ data: [] });

    // 인기 태그 조회 API
    const fetchPopularTags = axios.get(`http://localhost:3000/popular/tag`);

    Promise.all([fetchAllPlaces, fetchPopularPlaces, fetchUserData, fetchLikedPlaces, fetchPopularTags])
      .then(([allPlacesResponse, popularPlacesResponse, userDataResponse, likedPlacesResponse, popularTagsResponse]) => {
        setAllPlaces(allPlacesResponse.data.data);
        setPopularPlaces(popularPlacesResponse.data.data);
        setUserData(userDataResponse.data);
        setLikedPlaces(likedPlacesResponse.data);
        setPopularTags(popularTagsResponse.data.data);
      })
      .catch((error) => {
        console.log('API 요청 오류 : ', error);
      });
  }, [isLogin]);

  // 좋아요 버튼
  const handleLikeToggle = async (geo_id) => {
    if (!isLogin) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
      return;
    }

    const isLiked = likedPlaces.some(place => place.geo_id === geo_id);
    const url = `http://localhost:3000/placeLikes/${geo_id}`;
    
    try {
      if (isLiked) {
        // 좋아요 취소
        await axios.delete(url, {
          withCredentials: true,
          data: {user_id : userData.id}
        });

        setLikedPlaces((prevPlaces) => prevPlaces.filter((place) => place.geo_id !== geo_id));
      } else {
        // 좋아요 등록
        await axios.post(url, {user_id : userData.id}, {
          withCredentials: true
        });
        setLikedPlaces((prevPlaces) => [...prevPlaces, {geo_id}]);
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
    }
  };

  return (
    <div className='main_container'>
        <section className='select'>
            <h1>어디로 가시나요?</h1>
            <img src={toggle_location} alt='toggle_location' onClick={toggleLocation}/>
        </section>

        <section className='areas'>
          <h3>{isDomestic ? '국내 여행지' : '해외 여행지'}</h3>
          <p>어디로 가시나요?</p>
          <ImgSlide boxWidth={268} boxHeight={240} gap={20} placesData={allPlaces}/>
        </section>

        <section className='popular_area'>
          <div className='popular_container'>
            <h3>인기 장소</h3>
            <div className='img_container'>
              {popularPlaces.slice(0, 3).map((place) => {
                const isLiked = likedPlaces.some(favoritePlace => favoritePlace.geo_id === place.geo_id);
                
                const backgroundImage = getImageForPlace(place.place_name); // 임시 이미지

                return (
                  <div 
                    key={place.geo_id} 
                    className='popular_box' 
                    onClick={() => navigate(`/place/${place.place_name}`)} 
                    style={{ backgroundImage: `url(${backgroundImage})`}}
                  >
                    <img 
                      src={isLogin ? (isLiked ? like_active : like_unactive) : like_unactive}
                      alt='like'
                      onClick={(e) => {
                        e.stopPropagation(); // img 클릭 시 이벤트 전파를 막음
                        handleLikeToggle(place.geo_id);
                      }} 
                      style={{cursor: 'pointer', zIndex: 10}}
                    />
                    <div
                        className="place-name"
                        style={{
                          position: 'absolute',
                          left: '21px',
                          bottom: '15px',
                          fontFamily: 'PretendardBold',
                          fontSize: '24px',
                          color: 'white',
                          zIndex: 1
                        }}
                      >
                        {place.place_name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className='popular_hashtags'>
          <h3>인기 해시태그</h3>
          <p>어떤 테마를 원하시나요?</p>
          <div className='popular_hashtags_container'>
            <div className='popular_hashtag_default'>#</div>
            {popularTags.map((tag, index) => (
              <div key={index} className='popular_hashtag' onClick={() => navigate(`/search?query=${tag.tag_name}`)}>{tag.tag_name}</div>
            ))} 
          </div>
        </section>
    </div>
  );
}

export default Main;

