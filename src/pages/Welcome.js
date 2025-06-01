import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';

// Welcome 컴포넌트 (props로 username을 받을 거라고 가정)
function Welcome({ username }) { 
  const navigate = useNavigate();

  // 시작하기 버튼 클릭 핸들러
  const handleStartGame = () => {
    navigate('/game'); // '/game' 경로로 이동
  };

  // 화면에 보여질 내용 (JSX)
  return (
    // body 안에 있던 내용을 <></>로 감싸기
    <>
      <div className="container">
        <img className="bg" src={process.env.PUBLIC_URL + "/img/background_gray.png"} alt="배경 이미지" />

        {/* 유저 닉네임 표시 */}
        <div className="welcome-message">
          {/* th:text 대신 자바스크립트 표현식 사용 */}
          <p>{username}님의 새로운 시작을 환영합니다.</p> {/* props로 받은 username 사용 */}
        </div>

        {/* 시작하기 버튼 */}
        <div className="start-game-btn">
        <button onClick={handleStartGame}>
            시작하기
          </button>
        </div>
      </div>
    </>
  );
}

export default Welcome;
