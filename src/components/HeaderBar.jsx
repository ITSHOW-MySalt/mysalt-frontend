import React from "react";
import "../styles/Game.css";

import Date from "./Date";
import MenuComponent from "./Menu";

function HeaderBar({ gameDay, toggleNews, lastNewsOpenedDay }) {
  const isNewsButtonEnabled = gameDay % 7 === 1 && lastNewsOpenedDay !== gameDay;

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

        <MenuComponent />
      </div>
    </div>
  );
}

export default HeaderBar;
