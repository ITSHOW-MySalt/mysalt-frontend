import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleEventType } from "../utils/GameEvents";
import getGameScript from "../data/GameScript";
import "../styles/GameScreen.css";
import ChoiceButtons from "./ChoiceButtons";

function GameScreen({ username, gameDay, onDayIncrement }) {
  const [gameScript, setGameScript] = useState({});
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [eventStoryText, setEventStoryText] = useState("");
  const [isEventActive, setIsEventActive] = useState(false);
  const [choices, setChoices] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("background_home.png"); // ⬅️ 배경 상태 추가

  useEffect(() => {
    if (!username || gameDay === 0) return;

    const initEvent = async () => {
      const eventType = await fetchEventType();
      await handleEventType(
        eventType,
        setEventStoryText,
        setIsEventActive,
        setCurrentScriptIndex,
        gameDay,
        username,
        setBackgroundImage // ⬅️ 배경 세터 전달
      );
    };

    initEvent();
  }, [username, gameDay]);

  const fetchEventType = async () => {
    try {
      const res = await fetch(`/api/events/next?username=${username}`);
      const data = await res.json();
      console.log("이벤트 타입 수신:", data);
      return data;
    } catch (err) {
      console.error("이벤트 타입 로딩 실패:", err);
      return null;
    }
  };

  useEffect(() => {
    if (username) {
      const script = getGameScript(username);
      setGameScript(script);
    }
  }, [username]);

  const goToNextScript = async () => {
    const dayKey = `day${gameDay}`;
    const currentDayScript = gameScript[dayKey];
    const nextIndex = currentScriptIndex + 1;

    if (currentDayScript && nextIndex < currentDayScript.length) {
      setCurrentScriptIndex(nextIndex);
      setEventStoryText(currentDayScript[nextIndex]);
    } else {
      console.log("📘 더 이상 다음 대사가 없습니다.");

      try {
        await axios.post("/api/next-day", { username });
        const res = await axios.get(`/api/init?username=${username}`);
        const data = res.data;

        onDayIncrement(data.current_day, {
          money: data.ch_stat_money,
          health: data.ch_stat_health,
          mental: data.ch_stat_mental,
          reputation: data.ch_stat_rep,
        });

        setCurrentScriptIndex(0);
        setEventStoryText(gameScript[`day${data.current_day}`]?.[0] || "");
        setIsEventActive(false);
      } catch (error) {
        console.error("Day 증가 실패:", error);
      }
    }
  };

  const onChoiceSelected = (index) => {
    console.log("선택지 선택됨:", index);
    setChoices([]);
    setIsEventActive(false);
  };

  return (
    <>
      <div className="main-container">
        <img
          className="background-img"
          src={process.env.PUBLIC_URL + "/img/" + backgroundImage}
          alt="게임 배경"
        />

        <div className="game-overlay">
          <div className="game-story-text">
            <p>{eventStoryText}</p>
          </div>
        </div>
      </div>

      {(choices.length > 0 || !isEventActive) && (
        <ChoiceButtons
          choices={choices}
          onChoiceSelected={onChoiceSelected}
          onNext={goToNextScript}
        />
      )}
    </>
  );
}

export default GameScreen;
