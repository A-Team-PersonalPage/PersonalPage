import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import './MyPage.css';
import profile from '../../assets/img/profile.svg';
import x from '../../assets/img/x.svg';
import plus from '../../assets/img/plus.svg';
import like_active from '../../assets/img/ic_like_active.svg';

function MyPage() {
  const navigate = useNavigate();

  const [viewAllTags, setViewAllTags] = useState(false);
  const [activeTag, setActiveTag] = useState([]);

  const viewAll = () => { // 전체 태그 확인하는 함수
    setViewAllTags(!viewAllTags);
  }

  // 태그 클릭 시 active 클래스를 토글하는 함수
  const toggleTag = (tag) => {
    setActiveTag((prevActiveTag) => {
      if (prevActiveTag.includes(tag)) {
        // 이미 활성화된 태그라면 비활성화
        return prevActiveTag.filter((t) => t !== tag);
      } else {
        // 비활성화된 태그라면 활성화
        return [...prevActiveTag, tag];
      }
    });
  }

  const removeTag = (tag) => {
    setActiveTag((prevActiveTag) => prevActiveTag.filter((t) => t !== tag));
  };
  
  return (
    <div className='mypage_container'>
        <div className='porfile_container'>
            <img src={profile} />

            <div className='information'>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이름</p>
                    <p className='info_content'>가나다</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이메일</p>
                    <p className='info_content'>abc@email.com</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>연락처</p>
                    <p className='info_content'>010-1234-5678</p>
                </div>

                <div className='btn_container'>
                  <button className='delete_btn'>계정탈퇴</button>
                  <button className='edit_btn' onClick={() => navigate("/myPage/edit")}>수정하기</button>
                </div>
            </div>

            <div className='likes_container'>
              <p className='like_title'>선호 해시태그</p>
              
              <div className='tags_container'>
                <div className='tag' style={{color: 'black'}}>#</div>
                {activeTag.map((tag, index) => (
                   <div key={index} className='tag'>
                   {tag}
                   <img
                     src={x} // X 아이콘
                     alt='remove'
                     onClick={() => removeTag(tag)} // 클릭 시 해당 태그 비활성화
                     style={{ cursor: 'pointer', marginLeft: '8px' }}
                   />
                 </div>
                ))}
                <div className='tag' style={{color: 'black', cursor: 'pointer'}} onClick={() => viewAll()}>
                  <img src={plus} width={14}/>
                </div>
              </div>

              {viewAllTags && (
                  <div className='all_tags_container'>
                    <div className={`tags ${activeTag.includes('힐링') ? 'active' : ''}`} onClick={() => toggleTag('힐링')}>힐링</div>
                    <div className={`tags ${activeTag.includes('활동적인') ? 'active' : ''}`} onClick={() => toggleTag('활동적인')}>활동적인</div>
                    <div className={`tags ${activeTag.includes('친구들과 함께하는') ? 'active' : ''}`} onClick={() => toggleTag('친구들과 함께하는')}>친구들과 함께하는</div>
                    <div className={`tags ${activeTag.includes('부모님과 함께하는') ? 'active' : ''}`} onClick={() => toggleTag('부모님과 함께하는')}>부모님과 함께하는</div>
                  </div>
              )}
            </div>

            <div className='likes_container' style={{marginBottom: 80}}>
              <p className='like_title'>좋아요</p>
              <div className='like_places_container'>
                <div className="places">
                  <img src={like_active}/>
                </div>
                <div className="places">
                  <img src={like_active}/>
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}

export default MyPage;