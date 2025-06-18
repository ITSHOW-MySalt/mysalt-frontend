import React, { useState, useEffect } from "react";
import "../styles/Game.css";

import Date from "./Date";
import MenuComponent from "./Menu"; // MenuComponent import 유지
// import MenuWindow from "./MenuWindow"; // Game.jsx에서 렌더링하므로 여기서 import 필요 없음
// import NewsComponent from "./News"; // Game.jsx에서 렌더링하므로 여기서 import 필요 없음

import axios from "axios";

// toggleNews, toggleMenu prop 추가
function HeaderBar({ gameDay, lastNewsOpenedDay, username, userId, toggleNews, toggleMenu }) {
  // 로컬 isMenuOpen 상태 제거
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 뉴스 아이콘 클릭 시 로딩 상태 (버튼 비활성화용)

  // 로컬 뉴스 상태 제거
  // const [showNews, setShowNews] = useState(false);
  // const [newsData, setNewsData] = useState(null);
  // const [newsOpenedDay, setNewsOpenedDay] = useState(null);
  const [newsSavedDay, setNewsSavedDay] = useState(null); // 뉴스 저장 로직에 필요

  // 뉴스 버튼 활성화 조건 (Game.jsx의 lastNewsOpenedDay 사용)
  const isNewsButtonEnabled =
    gameDay % 7 === 1 &&
    lastNewsOpenedDay !== gameDay;

  // 뉴스 저장 API 자동 호출 (하루 한 번만)
  useEffect(() => {
    const shouldSaveNews = gameDay % 7 === 1 && newsSavedDay !== gameDay;

    if (shouldSaveNews) {
      const saveNews = async () => {
        try {
          await axios.post("/api/news/random-ids", null, {
            params: { gameProgressId: userId },
            withCredentials: true,
          });
          console.log("자동 뉴스 저장 완료");
          setNewsSavedDay(gameDay); // 오늘 저장한 걸로 표시
        } catch (error) {
          console.error("자동 뉴스 저장 실패:", error);
        }
      };

      saveNews();
    }
  }, [gameDay, newsSavedDay, userId]);


  // 뉴스 아이콘 클릭 핸들러
  const handleNewsClick = async () => {
    if (!isNewsButtonEnabled) return;

    setLoading(true); // 로딩 시작 (버튼 비활성화)
    try {
        toggleNews(); // Game.jsx에서 받은 toggleNews 함수 호출
    } catch (error) {
        console.error("뉴스 열기 실패:", error);
        // 에러 처리...
    } finally {
        setLoading(false); // 로딩 끝
    }
  };


  return (
    <div className="header-bar">
      <Date gameDay={gameDay} />

      <div className="right-icons">
        <button
          className="icon-button"
          onClick={handleNewsClick} // 수정된 handleNewsClick 연결
          disabled={!isNewsButtonEnabled || loading}
          style={{ opacity: isNewsButtonEnabled ? 1 : 0.3 }}
        >
          <img
            src={process.env.PUBLIC_URL + "/img/news_icon.png"}
            alt="뉴스"
            className="news-icon"
          />
        </button>

        {/* MenuComponent에 Game.jsx에서 받은 toggleMenu 함수 전달 */}
        {/* MenuComponent는 이제 이 onClick prop을 받아서 메뉴 아이콘 클릭 시 호출해야 함 */}
        <MenuComponent onClick={toggleMenu} />
      </div>

      {/* MenuWindow와 NewsComponent 렌더링은 Game.jsx에서 담당 */}
      {/* {isMenuOpen && (
        <MenuWindow onClose={() => setIsMenuOpen(false)} username={username} />
      )} */}

      {/* {showNews && (
        <NewsComponent userId={userId} onClose={() => {
          setShowNews(false);
          setNewsData(null);
        }} />
      )} */}
    </div>
  );
}

export default HeaderBar;
