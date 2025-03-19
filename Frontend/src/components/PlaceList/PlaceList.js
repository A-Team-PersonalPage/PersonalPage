import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './PlaceList.css';

function PlaceList({placesData}) {
  const navigate = useNavigate();
  
  return (
    <div>
    {placesData.map((place, index) => (
        <div className="list_container">
            <div className="place_img_box"></div>
            <div className="list_text_container">
                <div className="list_content_container">
                    <p className="list_title">{place.place_name}</p>
                    <p className="list_intro">{place.place_info}</p>
                </div>
                
                <div className='list_tags_container'>
                    <div className='list_tag_default'>#</div>
                    {place.tag_name.map((tag, tagIndex) => (
                        <div className="list_tags" key={tagIndex}>{tag}</div>
                    ))}
                </div>
            </div>
        </div>
    ))}
    </div>
  )
}

export default PlaceList;
