import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Gender.css';

function Gender() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img className="bg" src={process.env.PUBLIC_URL + "/img/background_gray.png"} alt="배경 이미지" />
      
      <button className="back-button" onClick={() => navigate('/Username')}>
        <img src={process.env.PUBLIC_URL + "/img/back_arrow.png"} alt="뒤로가기" />
      </button>

      <div className="question-box">
        <p>당신의 성별은 무엇인가요?</p>
        <p>(스토리에 영향을 끼치지 않습니다.)</p>
      </div>

      <div className="gender-btns">
        <button type="button" className="gender-btn" onClick={() => navigate('/Welcome')}>여자</button>
        <button type="button" className="gender-btn" onClick={() => navigate('/Welcome')}>남자</button>
      </div>
    </div>
  );
}

export default Gender;
