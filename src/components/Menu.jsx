import React from "react";

// Menu 아이콘 컴포넌트 (HeaderBar에서 클릭 이벤트 핸들러를 prop으로 받음)
function MenuComponent({ onClick }) { 
    return (
        // 메뉴 아이콘 img 태그 내용
        <img
          src={process.env.PUBLIC_URL + "/img/menu_icon.png"} 
          alt="Menu" 
          className="icon" 
          onClick={onClick} // 클릭 이벤트 prop으로 연결
          style={{ cursor: 'pointer' }} // 클릭 가능한 것처럼 보이게
        />
    );
}

export default MenuComponent; 
