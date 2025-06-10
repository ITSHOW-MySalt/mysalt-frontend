import React from "react";
import "../styles/Game2.css"; // 상단 아이콘 스타일 import 유지

import Date from "./Date"; 
import NewsComponent from "./News"; // 🔥 이름 충돌 피하기! 뉴스 '아이콘' 컴포넌트는 NewsIconComponent 로 임포트!
import MenuComponent from "./Menu"; // 🔥 이름 충돌 피하기! 메뉴 '아이콘' 컴포넌트는 MenuIconComponent 로 임포트!


// HeaderBar 컴포넌트 정의
function HeaderBar({ gameDay, toggleNews }) {
    // 햄버거 메뉴 토글 함수는 Game.jsx에서 만들어서 prop으로 전달받아야 함.
    // const toggleMenu = () => { ... }; // Game.jsx에서 만들어서 prop으로 전달받는다고 가정

    // 만약 Game.jsx에서 메뉴 토글 함수를 toggleMenu라는 이름으로 전달한다면
    // function HeaderBar({ gameDay, toggleNews, toggleMenu }) { ... } 로 변경


    return (
        <div className="header-bar">
            {/* 분리된 Date 컴포넌트 사용 및 gameDay prop 전달 */}
            <Date gameDay={gameDay} />

            <div className="right-icons">
                {/* 🔥 분리된 News 아이콘 컴포넌트 사용 및 toggleNews prop 전달 🔥 */}
                <NewsComponent onClick={toggleNews} /> {/* import 할 때 이름 바꾼 걸로 사용 */}

                {/* 🔥 분리된 Menu 아이콘 컴포넌트 사용 🔥 */}
                {/* 나중에 Game.jsx에서 메뉴 토글 함수(예: toggleMenu)를 prop으로 받으면 */}
                {/* onClick={toggleMenu} prop을 전달해야 함. */}
                <MenuComponent /> {/* import 할 때 이름 바꾼 걸로 사용 */}
            </div>
        </div>
    );
}

export default HeaderBar; // HeaderBar 컴포넌트만 export
