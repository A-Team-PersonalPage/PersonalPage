import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageForPlace } from "../../utils/imageUtils";
import "./ImgSlide.css";
import nextRight from '../../assets/img/ic_next_right.svg';
import nextLeft from '../../assets/img/ic_next_left.svg';

const ImgSlide = ({boxWidth, boxHeight, gap, placesData}) => {
  const totalBoxes = placesData.length;
  const navigate = useNavigate();

  // 슬라이드 상태 관리
  const [position, setPosition] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const totalWidth = boxWidth + gap;

  // 오른쪽 버튼 클릭 시
  const slideRight = () => {
    if (position < -(totalBoxes - 5) * totalWidth) {
      setIsLast(true);
    } else if (position === -(totalBoxes - 5) * totalWidth){
      setIsLast(true);
      setPosition(position - totalWidth);
      setIsFirst(false);
    } else {
      setPosition(position - totalWidth); // 오른쪽으로 슬라이드
      setIsFirst(false);
    }
  };

  // 왼쪽 버튼 클릭 시
  const slideLeft = () => {
    if (position === 0) {
       setIsFirst(true);
    } else if (position === -totalWidth) {
      setIsFirst(true);
      setPosition(position + totalWidth);
      setIsLast(false);
    } else {
      setPosition(position + totalWidth); // 왼쪽으로 슬라이드
      setIsLast(false);
    }
  };

  return (
    <div className="ImgSlide">
      <div className="slider-container">
        <button className="left-button" onClick={slideLeft} style={{display : isFirst ? 'none' : 'block'}}>
          <img src={nextLeft}></img>
        </button>
        <div className="slider" style={{ transform: `translateX(${position}px)` }}>
          {placesData.map((place, index) => {
              const backgroundImage = getImageForPlace(place.place_name); // 임시 이미지

              return (
                <div className="box" key={index} style={{ width: boxWidth, height: boxHeight, backgroundImage: `url(${backgroundImage})` }} onClick={() => navigate(`/place/${place.place_name}`)}>
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
        <button className="right-button" onClick={slideRight} style={{display : isLast ? 'none' : 'block'}}>
          <img src={nextRight}></img>
        </button>
      </div>
    </div>
  );
};

export default ImgSlide;
