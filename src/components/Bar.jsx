import React from "react";
import "../styles/Game2.css";

// props로 toggleNews 함수를 받도록 수정
function Bar({ toggleNews }) {
  return (
    <div className="header-bar">
      <div className="left-title">D +1</div>
      <div className="right-icons">
        {/* 뉴스 아이콘 클릭 시 toggleNews 함수 실행 */}
        <img
          src={process.env.PUBLIC_URL + "/img/news_icon.png"}
          alt="News"
          className="icon"
          onClick={toggleNews} // 뉴스 아이콘 클릭 이벤트 연결
          style={{ cursor: 'pointer' }} // 클릭 가능한 것처럼 보이게 
        />
        <img src="/img/menu_icon.png" alt="Menu" className="icon" />
      </div>
    </div>
  );
}

export default Bar;
