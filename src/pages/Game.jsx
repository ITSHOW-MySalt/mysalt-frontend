import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import HeaderBar from "../components/HeaderBar"; // 상단 바 컴포넌트
import BottomStats from "../components/BottomStats"; // 하단 스탯 바 컴포넌트
import News from "../components/News"; // 뉴스 컴포넌트
import GameScreen from "../components/GameScreen";
import MenuWindow from "../components/MenuWindow";

import "../styles/Base.css";
import "../styles/Game.css";

function Game() {
  const location = useLocation();
  const username = location.state?.username;

  const [gameDay, setGameDay] = useState(0);
  const [stats, setStats] = useState({
    money: 0,
    health: 0,
    mental: 0,
    reputation: 0,
  });
  const [showNews, setShowNews] = useState(false);
  const [lastNewsOpenedDay, setLastNewsOpenedDay] = useState(-1);

  // 메뉴 창 열림/닫힘 상태 추가
  const [showMenu, setShowMenu] = useState(false);

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
      })
      .catch((err) => {
        console.error("게임 데이터 초기화 실패:", err);
      });
  }, [username]);

  // day 와 stats 업데이트 함수
  const updateDayAndStats = (newDay, newStats) => {
    setGameDay(newDay);
    setStats(newStats);
  };

  const toggleNews = () => {
    setShowNews(!showNews);
    if (!showNews) setLastNewsOpenedDay(gameDay);
  };

  // 메뉴 창 열고 닫는 함수 추가
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };


  return (
    <div className="main-container">
      <GameScreen
        username={username}
        gameDay={gameDay}
        onDayIncrement={updateDayAndStats}
      />

      {/* HeaderBar 컴포넌트 사용 및 props 전달 */}
      {/* HeaderBar에 메뉴 토글 함수도 prop으로 전달 */}
      <HeaderBar
        gameDay={gameDay}
        toggleNews={toggleNews}
        lastNewsOpenedDay={lastNewsOpenedDay}
        toggleMenu={toggleMenu} // 메뉴 토글 함수 prop 추가
      />

      <BottomStats stats={stats} />
      {showNews && <News onClose={toggleNews} />}

      {/* showMenu 상태가 true일 때만 메뉴 창 컴포넌트 보여주기 */}
      {showMenu && <MenuWindow onClose={toggleMenu} />}


    </div>
  );
}

export default Game;
