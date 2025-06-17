import React, { useState, useEffect } from "react";
import "../styles/Game.css";

import Date from "./Date";
import MenuComponent from "./Menu";
import MenuWindow from "./MenuWindow";
import NewsComponent from "./News";
import axios from "axios";

function HeaderBar({ gameDay, lastNewsOpenedDay, username, userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newsData, setNewsData] = useState(null);
  const [showNews, setShowNews] = useState(false);
  const [newsOpenedDay, setNewsOpenedDay] = useState(null);
  const [newsSavedDay, setNewsSavedDay] = useState(null); // ✅ 추가

  const isNewsButtonEnabled =
    gameDay % 7 === 1 &&
    lastNewsOpenedDay !== gameDay &&
    newsOpenedDay !== gameDay;

  // ✅ 뉴스 저장 API 자동 호출 (하루 한 번만)
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

        <MenuComponent onClick={() => setIsMenuOpen(true)} />
      </div>

      {isMenuOpen && (
        <MenuWindow onClose={() => setIsMenuOpen(false)} username={username} />
      )}

      {showNews && (
        <NewsComponent userId={userId} onClose={() => {
          setShowNews(false);
          setNewsData(null);
        }} />
      )}
    </div>
  );
}

export default HeaderBar;
