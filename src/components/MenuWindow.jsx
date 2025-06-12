import React from "react";
import "../styles/MenuWindow.css"; 

function MenuWindow({ onClose }) {
  return (
    <>
      {/* 배경 어둡게 깔기 */}
      <div className="menu-overlay" onClick={onClose}></div>

      {/* 메뉴창 박스 */}
      <div className="menu-window">
        <button className="menu-item" onClick={() => alert("도감 클릭")}>도감</button>
        <button className="menu-item" onClick={() => alert("설정 클릭")}>설정</button>
        <button className="menu-item" onClick={() => alert("시작화면 클릭")}>시작화면</button>
      </div>
    </>
  );
}

export default MenuWindow;
