import React, {useState} from 'react';
import './MyPage.css';
import profile from '../../assets/img/profile.svg';
import { useNavigate } from "react-router-dom";

function MyPageEdit() {
    const navigate = useNavigate();

  return (
    <div className='mypage_container'>
        <div className='porfile_container'>
            <img src={profile} />

            <div className='information'>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이름</p>
                    <div className='edit_container'>
                        <p className='info_content'>가나다</p>
                        <input type='text' placeholder='가나다' className='edit_input'/>
                    </div>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이메일</p>
                    <p className='info_content'>abc@email.com</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>연락처</p>
                    <div className='edit_container'>
                        <p className='info_content'>010-1234-5678</p>
                        <input type='text' placeholder='010-1234-5678' className='edit_input'/>
                    </div>
                </div>
            </div>

            <div className='edit_complete'>
                <p className='is_complete'>계정 정보 수정을 완료하셨나요?</p>
                <div className='complete_btn_container'>
                    <button onClick={() => navigate(-1)} className='cancel_btn'>뒤로가기</button>
                    <button className='edit_btn'>수정하기</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default MyPageEdit;