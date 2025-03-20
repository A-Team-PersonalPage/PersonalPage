import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getImageForPlace } from "../../utils/imageUtils";
import "./PlaceList.css";

function PlaceList({ placesData }) {
  const navigate = useNavigate();

  const [tags, setTags] = useState({});

  useEffect(() => {
    const fetchTags = async () => {
      const newTags = {};
      for (const place of placesData) {
        try {
          const response = await axios.get(`http://localhost:3000/place_tags/${place.geo_id}`);
          newTags[place.geo_id] = response.data.map(tagObj => tagObj.tag_name);
        } catch (error) {
          console.log(`태그 검색 실패 (geo_id: ${place.geo_id}): `, error);
          newTags[place.geo_id] = [];
        }
      }
      setTags(newTags);
    };

    if (placesData.length > 0) {
      fetchTags();
    }
  }, [placesData]);

  return (
    <div>
      {placesData.map((place, index) => (
        <div
          className="list_container"
          onClick={() => navigate(`/place/${place.place_name}`)}
        >
          <div
            className="place_img_box"
            style={{
              backgroundImage: `url(${getImageForPlace(place.place_name)})`,
            }}
          ></div>

          <div className="list_text_container">
            <div className="list_content_container">
              <p className="list_title">{place.place_name}</p>
              <p className="list_intro">{place.place_info}</p>
            </div>

            <div className='list_tags_container'>
                    <div className='list_tag_default'>#</div>
                    { tags[place.geo_id] && tags[place.geo_id].length > 0 ? (
                      tags[place.geo_id].map((tag, tagIndex) => (
                        <div className="list_tags" key={tagIndex}>{tag}</div>
                      ))
                    ) : null}
              </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlaceList;