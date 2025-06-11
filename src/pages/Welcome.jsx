import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Welcome.css";
import "../styles/Button.css";
import "../styles/Base.css";
import "../styles/Form.css";
import FontStyles from "../components/FontStyles";

function WelcomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "사용자";
  const isReturning = location.state?.isReturning || false;

  const handleClick = () => {
    navigate("/Game", { state: { username, isReturning } });
  };

  return (
    <>
      <FontStyles />
      <div className="main-container">
        <img
          className="background-img"
          src={process.env.PUBLIC_URL + "/img/background_gray.png"}
          alt="배경"
        />

       <div className="welcome-overlay">
        <div className="question-text">
          <p>
            {username}
            {isReturning ? "님의 복귀를 환영합니다." : "님의 새로운 시작을 환영합니다."}
          </p>
        </div>

          <button onClick={handleClick} className="next-button">
            {isReturning ? "이어하기" : "시작하기"}
          </button>
      </div>
      </div>
    </>
  );
}

export default WelcomeScreen;
