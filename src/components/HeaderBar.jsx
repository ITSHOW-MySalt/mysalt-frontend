import React, { useState } from "react";
import "../styles/Game.css";

import Date from "./Date";
import MenuComponent from "./Menu";
import MenuWindow from "./MenuWindow";
import axios from "axios";

function HeaderBar({ gameDay, toggleNews, lastNewsOpenedDay, username }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 뉴스 버튼은 7일마다 한 번만 활성화
  const isNewsButtonEnabled = gameDay % 7 === 1 && lastNewsOpenedDay !== gameDay;

  const handleNewsClick = async () => {
    if (!isNewsButtonEnabled || loading) return;

    setLoading(true);
    try {
      // 기존 뉴스 삭제 + 새 뉴스 3개 저장 요청
      await axios.post("/api/news/random-ids", null, {
        params: { gameProgressId: 1 },
      });

      // 뉴스 모달 열기
      toggleNews();
    } catch (error) {
      console.error("뉴스 저장 중 오류 발생:", error);
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
    </div>
  );
}

export default HeaderBar;
