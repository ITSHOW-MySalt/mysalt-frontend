import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import BottomStats from "../components/BottomStats"; // 스탯창 컴포넌트
import NewsComponent from "../components/News"; // NewsComponent로 이름 변경
import GameScreen from "../components/GameScreen";
import MenuWindow from "../components/MenuWindow"; // MenuWindow import 유지

import "../styles/Base.css";
import "../styles/Game.css";

function Game() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username");

  const [gameDay, setGameDay] = useState(0);
  const [stats, setStats] = useState({
    money: 0,
    health: 0,
    mental: 0,
    reputation: 0,
  });
  const [userId, setUserId] = useState(null);
  const [showNews, setShowNews] = useState(false); // 뉴스창 열림/닫힘 상태
  const [lastNewsOpenedDay, setLastNewsOpenedDay] = useState(-1);
  const [showMenu, setShowMenu] = useState(false); // 메뉴창 열림/닫힘 상태 유지

  // 사용자 ID 가져오기
  useEffect(() => {
    if (!username) return;

    const fetchUserId = async () => {
      try {
        const res = await axios.get(`/api/user/id?username=${username}`);
        setUserId(res.data.userId);
      } catch (error) {
        console.error("사용자 ID 가져오기 실패:", error);
      }
    };

    fetchUserId();
  }, [username]);

  // 게임 초기 상태 가져오기
  useEffect(() => {
    if (!username) return;

    axios
      .get(`/api/init?username=${username}`)
      .then((res) => {
        const data = res.data;
        setGameDay(data.current_day);
        setStats({
          money: data.ch_stat_money,
          health: data.ch_stat_health,
          mental: data.ch_stat_mental,
          reputation: data.ch_stat_rep,
        });

        localStorage.setItem("username", username);
      })
      .catch((err) => {
        console.error("게임 데이터 초기화 실패:", err);
      });
  }, [username]);

  // 변화량으로 스탯 갱신
  const updateDayAndStats = (newDay, statDelta) => {
    setGameDay(newDay);
    setStats((prev) => ({
      money: prev.money + statDelta.money,
      health: prev.health + statDelta.health,
      mental: prev.mental + statDelta.mental,
      reputation: prev.reputation + statDelta.reputation,
    }));
  };

  // 뉴스창 상태 토글만 수행
  const toggleNews = () => {
    setShowNews(!showNews); // 뉴스창 상태 토글
    // 뉴스창을 열 때만 날짜 기록 (HeaderBar에서 사용)
    if (!showNews) {
        setLastNewsOpenedDay(gameDay);
    }
  };

  // 메뉴창 상태 토글 함수
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="main-container">
      <GameScreen
        username={username}
        username_id={userId}
        gameDay={gameDay}
        onDayIncrement={updateDayAndStats}
        currentStats={stats}
      />

      <HeaderBar
        gameDay={gameDay}
        toggleNews={toggleNews} // Game.jsx의 toggleNews 함수를 HeaderBar로 전달
        toggleMenu={toggleMenu}
        lastNewsOpenedDay={lastNewsOpenedDay} // HeaderBar에서 뉴스 버튼 활성화/비활성화에 사용
        username={username} // HeaderBar에서 뉴스 저장 API 호출에 사용
        userId={userId} 
      />

      {/* showNews 상태에 따라 뉴스창 또는 스탯창 렌더링 */}
      {showNews && <NewsComponent onClose={toggleNews} userId={userId} />}
      {!showNews && <BottomStats stats={stats} />}

      {/* showMenu 상태에 따라 메뉴창 렌더링 */}
      {showMenu && <MenuWindow onClose={toggleMenu} username={username} />}
    </div>
  );
}

export default Game;
