// Game.jsx
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
  const [userId, setUserId] = useState(null);
  const [showNews, setShowNews] = useState(false);
  const [lastNewsOpenedDay, setLastNewsOpenedDay] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);

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

  // ✅ 변화량으로 스탯 갱신
  const updateDayAndStats = (newDay, statDelta) => {
    setGameDay(newDay);
    setStats((prev) => ({
      money: prev.money + statDelta.money,
      health: prev.health + statDelta.health,
      mental: prev.mental + statDelta.mental,
      reputation: prev.reputation + statDelta.reputation,
    }));
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
        username_id={userId}
        gameDay={gameDay}
        onDayIncrement={updateDayAndStats}
        currentStats={stats}
      />

      <HeaderBar
        gameDay={gameDay}
        toggleNews={toggleNews}
        lastNewsOpenedDay={lastNewsOpenedDay}
        username={username}
        userId={userId}
      />

      <BottomStats stats={stats} />
      {showNews && <News onClose={toggleNews} />}
      {showMenu && <MenuWindow onClose={toggleMenu} username={username} />}
    </div>
  );
}

export default Game;
