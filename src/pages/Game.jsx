import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ navigate 추가

import HeaderBar from "../components/HeaderBar";
import BottomStats from "../components/BottomStats";
import NewsComponent from "../components/News";
import GameScreen from "../components/GameScreen";
import MenuWindow from "../components/MenuWindow";

import "../styles/Base.css";
import "../styles/Game.css";

import { handleEventType } from "../utils/GameEvents";

function Game() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ navigate 선언
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

  const [isEnding, setIsEnding] = useState(false);
  const [eventStoryText, setEventStoryText] = useState("");
  const [eventBackgroundImage, setEventBackgroundImage] = useState(null);

  const [isEventActive, setIsEventActive] = useState(false);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [newsEventData, setNewsEventData] = useState(null);

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
  const updateDayAndStats = async (newDay, statDelta) => {
    setGameDay(newDay);
    setStats((prev) => ({
      money: prev.money + statDelta.money,
      health: prev.health + statDelta.health,
      mental: prev.mental + statDelta.mental,
      reputation: prev.reputation + statDelta.reputation,
    }));

    try {
      const res = await axios.get(`/api/ending/${userId}`);
      if (res.data && res.data.endingName && res.data.imglink) {
        // 엔딩 조건 충족 시
        await handleEventType(
          7,
          setEventStoryText,
          setIsEventActive,
          setCurrentScriptIndex,
          newDay,
          username,
          setEventBackgroundImage,
          setNewsEventData,
          userId,
          res.data.endingName,
          `/img/${res.data.imglink}`,
          navigate
        );
      }
    } catch (err) {
      console.error("엔딩 조건 확인 중 오류:", err);
    }
  };

  // 엔딩 체크 함수
  const checkEnding = async () => {
    try {
      const res = await axios.get("/api/check-ending", {
        params: { username: username },
      });

      if (res.data && res.data.endingname && res.data.imglink) {
        setIsEnding(true);
        setEventStoryText(res.data.endingname);
        setEventBackgroundImage(`/img/${res.data.imglink}`);

        await handleEventType(
          7, // 엔딩 타입
          setEventStoryText,
          setIsEventActive,
          setCurrentScriptIndex,
          gameDay,
          username,
          setEventBackgroundImage,
          setNewsEventData,
          userId,
          res.data.endingname,
          `/img/${res.data.imglink}`,
          navigate // ✅ navigate 전달
        );
      } else {
        setIsEnding(false);
        setEventStoryText("");
        setEventBackgroundImage(null);
      }
    } catch (error) {
      console.error("❌ 엔딩 체크 실패:", error);
    }
  };

  const toggleNews = () => {
    setShowNews(!showNews);
    if (!showNews) {
      setLastNewsOpenedDay(gameDay);
    }
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
        isEnding={isEnding}
        eventStoryText={eventStoryText}
        eventBackgroundImage={eventBackgroundImage}
        setIsEnding={setIsEnding}
        setEventStoryText={setEventStoryText}
        setEventBackgroundImage={setEventBackgroundImage}
        checkEnding={checkEnding}
        isEventActive={isEventActive}
        setIsEventActive={setIsEventActive}
        currentScriptIndex={currentScriptIndex}
        setCurrentScriptIndex={setCurrentScriptIndex}
        newsEventData={newsEventData}
        setNewsEventData={setNewsEventData}
      />

      <HeaderBar
        gameDay={gameDay}
        toggleNews={toggleNews}
        toggleMenu={toggleMenu}
        lastNewsOpenedDay={lastNewsOpenedDay}
        username={username}
        userId={userId}
      />

      {showNews && <NewsComponent onClose={toggleNews} userId={userId} />}
      {!showNews && <BottomStats stats={stats} />}

      {showMenu && <MenuWindow onClose={toggleMenu} username={username} />}
    </div>
  );
}

export default Game;
