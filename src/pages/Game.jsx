import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import BottomStats from "../components/BottomStats";
import News from "../components/News";
import GameScreen from "../components/GameScreen";
import MenuWindow from "../components/MenuWindow";

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
  const [showNews, setShowNews] = useState(false);
  const [lastNewsOpenedDay, setLastNewsOpenedDay] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!username) return;

    // 백엔드에서 유저 초기 상태 가져오기
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

        localStorage.setItem("username", username); // 새로고침 대비 저장
      })
      .catch((err) => {
        console.error("게임 데이터 초기화 실패:", err);
      });
  }, [username]);

  const updateDayAndStats = (newDay, newStats) => {
    setGameDay(newDay);
    setStats(newStats);
  };

  const toggleNews = () => {
    setShowNews(!showNews);
    if (!showNews) setLastNewsOpenedDay(gameDay);
  };

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

      <HeaderBar
        gameDay={gameDay}
        toggleNews={toggleNews}
        lastNewsOpenedDay={lastNewsOpenedDay}
        username={username}
      />

      <BottomStats stats={stats} />
      {showNews && <News onClose={toggleNews} />}
      {showMenu && <MenuWindow onClose={toggleMenu} username={username} />}
    </div>
  );
}

export default Game;
