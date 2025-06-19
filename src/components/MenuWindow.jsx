import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../styles/MenuWindow.css";

function MenuWindow({ onClose, username }) {
  const navigate = useNavigate();

  const goToEncyclopedia = () => {
    onClose(); // 메뉴창 닫기
    navigate("/archive"); // 도감 페이지로 이동
  };

  const handleLogout = () => {
    localStorage.removeItem("username"); // 로컬 스토리지에서 사용자 이름 삭제
    navigate("/"); // 초기 페이지로 이동
  };

  const handleResetProgress = async () => {
    if (!username) {
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const response = await axios.post("/api/reset-progress", {
        username: username
      });

      if (response.status === 200) {
        alert("진행도가 초기화되었습니다.");
        navigate("/", { state: { username } }); // 초기화 후 재시작 (필요에 따라 수정 가능)
      } else {
        alert("진행도 초기화에 실패했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="menu-overlay" onClick={onClose}></div>

      <div className="menu-window">
        <button className="menu-item" onClick={goToEncyclopedia}>도감</button>
{/*         <button className="menu-item" onClick={() => alert("설정 클릭")}>설정</button> */}
        <button className="menu-item" onClick={handleResetProgress}>진행도 리셋</button>
        <button className="menu-item" onClick={handleLogout}>로그아웃</button>
      </div>
    </>
  );
}

export default MenuWindow;
