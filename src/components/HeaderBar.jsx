import React, { useState } from "react";
import "../styles/Game.css";

import Date from "./Date";
import MenuComponent from "./Menu";
import MenuWindow from "./MenuWindow";

function HeaderBar({ gameDay, toggleNews, lastNewsOpenedDay, username }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isNewsButtonEnabled = gameDay % 7 === 1 && lastNewsOpenedDay !== gameDay;

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
          onClick={toggleNews}
          disabled={!isNewsButtonEnabled}
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

      {/* 메뉴창에 username을 전달하도록 수정 */}
      {isMenuOpen && <MenuWindow onClose={handleCloseMenu} username={username} />}
    </div>
  );
}

export default HeaderBar;
