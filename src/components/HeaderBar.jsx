import React, { useState } from "react";
import "../styles/Game.css";

import Date from "./Date";
import MenuComponent from "./Menu";
import MenuWindow from "./MenuWindow";
import NewsComponent from "./News"; // 뉴스 모달
import axios from "axios";

function HeaderBar({ gameDay, lastNewsOpenedDay, username, userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 뉴스 관련 상태
  const [newsData, setNewsData] = useState(null);
  const [showNews, setShowNews] = useState(false);
  const [newsOpenedDay, setNewsOpenedDay] = useState(null); // 뉴스 연 날짜 기록

  // 뉴스 버튼 활성 조건: 7일 주기 + 오늘 안 열었고 + 내부 상태도 오늘 안 열었어야 함
  const isNewsButtonEnabled =
    gameDay % 7 === 1 &&
    lastNewsOpenedDay !== gameDay &&
    newsOpenedDay !== gameDay;

  // 뉴스 버튼 클릭 시 API 호출 + 모달 열기 + 오늘 날짜 저장
  const handleNewsClick = async () => {
    if (!isNewsButtonEnabled) return;

    setLoading(true);
    try {
      const response = await axios.get("/api/news/random-one", {
        params: { gameProgressId: userId },
        withCredentials: true,
      });
      setNewsData(response.data);
      setShowNews(true);
      setNewsOpenedDay(gameDay);
    } catch (error) {
      console.error("뉴스 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCloseNews = () => {
    setShowNews(false);
    setNewsData(null);
  };

  return (
    <div className="header-bar">
      <Date gameDay={gameDay} />

      <div className="right-icons">
        <button
          className="icon-button"
          onClick={handleNewsClick}
          disabled={!isNewsButtonEnabled || loading}
          style={{ opacity: isNewsButtonEnabled ? 1 : 0.3 }}
        >
          <img
            src={process.env.PUBLIC_URL + "/img/news_icon.png"}
            alt="뉴스"
            className="news-icon"
          />
        </button>

        <MenuComponent onClick={handleMenuClick} />
      </div>

      {isMenuOpen && (
        <MenuWindow onClose={handleCloseMenu} username={username} />
      )}

      {showNews && <NewsComponent userId={userId} onClose={handleCloseNews} />}
    </div>
  );
}

export default HeaderBar;
