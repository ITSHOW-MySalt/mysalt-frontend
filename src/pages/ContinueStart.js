import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/Base.css';
import "../styles/ContinueStart.css";
import '../components/Button.css';
import '../components/Form.css';
import FontStyles from '../components/FontStyles';

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

  return (
    <div className="continue-start-container">
      <button className="back-button" onClick={handleBack} aria-label="뒤로가기">
        <img
          src={process.env.PUBLIC_URL + "/img/back_arrow.png"}
          alt="뒤로가기"
        />
      </button>

      <div className="welcome-message">
        {username}님의 복귀를 환영합니다.
      </div>
      <div className="continueStart-overlay">
        <button onClick={handleContinue}>이어하기</button>
      </div>
    </div>
  );
}

export default ContinueStart;
