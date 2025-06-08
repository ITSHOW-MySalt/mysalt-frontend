import React, { useState } from "react";
import Bar from "../components/Bar"; // 상단 바 컴포넌트
import BottomStats from "../components/BottomStats"; // 하단 스탯 바 컴포넌트
import News from "../components/News"; // 뉴스 컴포넌트
import "../styles/Game.css";
import "../styles/Game2.css";
import "../styles/ChoiceButton.css";

function Game() {
  // 스탯 상태(임시)
  const [stats, setStats] = useState({
    asset: 10,
    health: 50,
    love: 80,
    reputation: 40,
  });

  const [showNews, setShowNews] = useState(false);

  // 뉴스 창 열고 닫는 함수
  const toggleNews = () => {
    setShowNews(!showNews);
  };

  // 나중에 선택지에 따라 setStats로 값 변경 가능

  return (
    <div className="main-container">
      <img
        className="background-img"
        src={process.env.PUBLIC_URL + "/img/background_gray.png"}
        alt="게임 배경 이미지"
      />
      <img
        className="background-home" 
        src={process.env.PUBLIC_URL + "/img/background_home.png"}
        alt="집 배경"
      />
      <Bar />
      <Bar toggleNews={toggleNews} />

      {/* 게임 메인 콘텐츠 영역 */}
      <div className="game-overlay">
        {/* 게임 스토리가 표시될 텍스트 */}
        <div className="game-story-text">
          <p>내이름은 id. 평범한 대학생이다.</p>
        </div>

        {/* 캐릭터 이미지 추가 */}
        {/* <img src="/img/character.png" alt="캐릭터"/> */}
      </div>

      <BottomStats stats={stats} />

      {/* 게임 선택지 영역 */}
      <div className="game-choices">
        {/* Button.css에 있는 main-button 스타일 사용 */}
        <button className="main-button">선택지 1 </button>
        <button className="main-button">선택지 2 </button>
      </div>

      {/* News 상태가 true일 때만 News 보여주기 */}
      {showNews && <News onClose={toggleNews} />}

    </div>
  );
}

export default Game;
