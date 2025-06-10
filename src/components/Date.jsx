import React from "react";

// HeaderBar에서 gameDay prop을 받아서 표시
function Date({ gameDay }) { 
    // 게임 날짜를 'D + n' 형식으로 표시
    const displayGameDay = `D + ${gameDay}`;
    return (
        // HeaderBar의 left-title div에 연결
        <div className="left-title">{displayGameDay}</div>
    );
}

export default Date;    
