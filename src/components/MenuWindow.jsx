import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MenuWindow.css";

function MenuWindow({ onClose }) {
  const navigate = useNavigate();

  const goToEncyclopedia = () => {
    onClose(); // 메뉴창 닫기
    navigate("/archive"); // 도감 페이지로 이동 
  };

  return (
    <>
      <div className="menu-overlay" onClick={onClose}></div>

      <div className="menu-window">
        <button className="menu-item" onClick={goToEncyclopedia}>도감</button>
        <button className="menu-item" onClick={() => alert("진행도 초기화 클릭")}>진행도 초기화</button>
        <button className="menu-item" onClick={() => alert("로그아웃 클릭")}>로그아웃</button>
      </div>
    </>
  );
}

export default MenuWindow;
