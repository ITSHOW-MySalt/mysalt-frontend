import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
  const [gender, setGender] = useState(-1);;

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

  //히로인 이벤트 db생성
  useEffect(() => {
    if (!userId) return;

    const initHeroineProgress = async () => {
      try {
        await axios.post("/api/heroin/init-progress", null, {
          params: { gameProgressId: userId },
        });
        console.log("✅ 히로인 진행도 초기화 완료");
      } catch (err) {
        if (err.response?.status === 409) {
          console.log("⚠️ 이미 히로인 진행도 존재함");
        } else {
          console.error("❌ 히로인 진행도 초기화 실패:", err);
        }
      }
    };

    initHeroineProgress();
  }, [userId]);


  // 게임 초기 상태 가져오기 및 엔딩 체크
  useEffect(() => {
    if (!username) return;

    const initGame = async () => {
      try {
        const res = await axios.get(`/api/init?username=${username}`);
        const data = res.data;

        setGameDay(data.current_day);
        setStats({
          money: data.ch_stat_money,
          health: data.ch_stat_health,
          mental: data.ch_stat_mental,
          reputation: data.ch_stat_rep,
        });

        setGender(data.gender || -1);

        localStorage.setItem("username", username);

        if (data.ending_list === 1) {
          await checkEnding();
        } else {
          resetEndingState();
        }
      } catch (err) {
        console.error("게임 데이터 초기화 실패:", err);
      }
    };

    initGame();
  }, [username]);

  const resetEndingState = () => {
    setIsEnding(false);
    setEventStoryText("");
    setEventBackgroundImage(null);
  };

  // 엔딩 체크 함수
  const checkEnding = async () => {
    try {
      const res = await axios.get("/api/check-ending", {
        params: { username },
      });

      if (res.data && res.data.ending && res.data.imglink) {
        const imgPath = `/img/${res.data.imglink}`;
        setIsEnding(true);
        setEventStoryText(res.data.ending);
        setEventBackgroundImage(imgPath);

        const resultChoices = await handleEventType(
          7,
          setEventStoryText,
          setIsEventActive,
          setCurrentScriptIndex,
          gameDay,
          username,
          setEventBackgroundImage,
          setNewsEventData,
          userId,
          res.data.ending,
          imgPath,
          navigate,
          gender
        );

        //setChoices(resultChoices || []);
      } else {
        resetEndingState();
      }
    } catch (error) {
      console.error("❌ 엔딩 체크 실패:", error);
    }
  };

  // 날짜 및 스탯 업데이트 함수
  const updateDayAndStats = async (newDay, statDelta) => {
    const updatedStats = {
      money: stats.money + statDelta.money,
      health: stats.health + statDelta.health,
      mental: stats.mental + statDelta.mental,
      reputation: stats.reputation + statDelta.reputation,
    };

    try {
      const res = await axios.get("/api/check-ending", {
        params: { username },
      });

      console.log("API 호출: /api/check-ending 응답 받음", JSON.stringify(res.data, null, 2));

      if (res.data && res.data.ending && res.data.imglink) {
        const imgPath = `/img/${res.data.imglink}`;
        setIsEnding(true);
        setEventStoryText(res.data.ending);
        setEventBackgroundImage(imgPath);

        await handleEventType(
          7,
          setEventStoryText,
          setIsEventActive,
          setCurrentScriptIndex,
          gameDay,
          username,
          setEventBackgroundImage,
          setNewsEventData,
          userId,
          res.data.ending,
          imgPath,
          navigate
        );
      }

      setGameDay(newDay);
      setStats(updatedStats);
      await checkEnding();
    } catch (error) {
      console.error("❌ 날짜 및 스탯 업데이트 실패:", error);
    }
  };

  const toggleNews = () => {
    setShowNews((prev) => !prev);
    if (!showNews) {
      setLastNewsOpenedDay(gameDay);
    }
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <div className="main-container">
      <GameScreen
        username={username}
        username_id={userId}
        gameDay={gameDay}
        setGameDay={setGameDay}
        onDayIncrement={updateDayAndStats}
        currentStats={stats}
        isEnding={isEnding}
        eventStoryText={eventStoryText}
        eventBackgroundImage={eventBackgroundImage}
        setIsEnding={setIsEnding}
        setEventStoryText={setEventStoryText}
        setEventBackgroundImage={setEventBackgroundImage}
        isEventActive={isEventActive}
        setIsEventActive={setIsEventActive}
        currentScriptIndex={currentScriptIndex}
        setCurrentScriptIndex={setCurrentScriptIndex}
        newsEventData={newsEventData}
        setNewsEventData={setNewsEventData}
        gender = {gender}
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
