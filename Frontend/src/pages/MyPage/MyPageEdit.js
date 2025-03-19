import React, { useState } from 'react';
import axios from 'axios';
import './MyPage.css';
import profile from '../../assets/img/profile.svg';
import { useNavigate, useLocation } from "react-router-dom";

function MyPageEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = location.state || {};

    // 기존 값으로 상태 초기화
    const [userName, setUserName] = useState(userData.user_name);
    const [userPhone, setUserPhone] = useState(userData.user_phone);

    // 입력 값 변경 시 상태 업데이트
    const handleNameChange = (e) => setUserName(e.target.value);
    const handlePhoneChange = (e) => setUserPhone(e.target.value);

    // 수정 완료 버튼 클릭 시 API 호출
  const handleSubmit = async () => {
    const updatedData = {
      user_name: userName || userData.user_name,  // 입력값이 없으면 기존값 사용
      user_phone: userPhone || userData.user_phone,  // 입력값이 없으면 기존값 사용
    };

    try {
      await axios.put('http://localhost:3000/mypage/modify', updatedData, {
        withCredentials: true
      });
      navigate('/mypage'); // 수정 완료 후 이전 페이지로 이동
    } catch (error) {
      console.error('수정 오류:', error);
    }
  };


  return (
    <div className='mypage_container'>
        <div className='porfile_container'>
            <img src={profile} alt='profile'/>

            <div className='information'>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이름</p>
                    <div className='edit_container'>
                        <p className='info_content'>{userData.user_name}</p>
                        <input 
                            type='text' 
                            placeholder={userData.user_name} className='edit_input'
                            value={userName}
                            onChange={handleNameChange}
                        />
                    </div>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이메일</p>
                    <p className='info_content'>{userData.user_email}</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>연락처</p>
                    <div className='edit_container'>
                        <p className='info_content'>{userData.user_phone}</p>
                        <input 
                            type='text' 
                            placeholder={userData.user_phone}
                            className='edit_input'
                            value={userPhone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                </div>
            </div>

            <div className='edit_complete'>
                <p className='is_complete'>계정 정보 수정을 완료하셨나요?</p>
                <div className='complete_btn_container'>
                    <button onClick={() => navigate(-1)} className='cancel_btn'>뒤로가기</button>
                    <button onClick={handleSubmit} className='edit_btn'>수정하기</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default MyPageEdit;