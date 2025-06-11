import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import BottomStats from "../components/BottomStats";
import News from "../components/News";
import GameScreen from "../components/GameScreen";

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

  const toggleNews = () => {
    setShowNews(!showNews);
    if (!showNews) setLastNewsOpenedDay(gameDay);
  };

  return (
    <div className="main-container">
      <GameScreen username={username} gameDay={gameDay} />

      <HeaderBar
        gameDay={gameDay}
        toggleNews={toggleNews}
        lastNewsOpenedDay={lastNewsOpenedDay}
      />

      <BottomStats stats={stats} />
      {showNews && <News onClose={toggleNews} />}
    </div>
  );
}

export default Game;
