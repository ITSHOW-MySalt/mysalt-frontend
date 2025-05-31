import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ContinueStart.css"; 

function ContinueStart() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "사용자"; 

  const handleBack = () => {
    navigate(-1); 
  };

  const handleContinue = () => {
    navigate("/nextStep"); 
  };

  const containerStyle = {
    position: 'relative',
    height: '100vh',
    backgroundColor: '#f5f5f5', 
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/background_gray.png)`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Noto Sans KR', sans-serif",
    color: '#333',
    width: '33.33vw', 
    margin: '0 auto', 
    overflow: 'hidden', 
  };

  return (
    <div className="continue-start-container" style={containerStyle}> 

      <button className="back-button" onClick={handleBack} aria-label="뒤로가기">
        <img 
          src={process.env.PUBLIC_URL + "/img/back_arrow.png"} 
          alt="뒤로가기" 
        />
      </button>

      <div className="welcome-message">
        {username}님의 복귀를 환영합니다.
      </div>
      <div className="start-game-btn">
        <button onClick={handleContinue}>이어하기</button>
      </div>
    </div>
  );
}

export default ContinueStart;