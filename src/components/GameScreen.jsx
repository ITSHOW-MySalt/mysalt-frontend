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

  const [backgroundImage] = useState("/img/background_gameUi.png"); // 항상 보이는 UI 배경
  const [eventBackgroundImage, setEventBackgroundImage] = useState(null); // 상황에 따라 보이는 배경

  useEffect(() => {
    if (!username || gameDay === 0) return;

    const initEvent = async () => {
      const type = await fetchEventType();

      const jobChoices = await handleEventType(
        type,
        setEventStoryText,
        setIsEventActive,
        setCurrentScriptIndex,
        gameDay,
        username,
        setEventBackgroundImage
      );

      if (jobChoices && jobChoices.length > 0) {
        setChoices(jobChoices);
      } else {
        setChoices([]);
      }
    };

    initEvent();
  }, [username, gameDay]);

  const fetchEventType = async () => {
    try {
      const res = await axios.get(`/api/events/next?username=${username}`);
      return res.data;
    } catch (err) {
      console.error("❌ 이벤트 타입 로딩 실패:", err);
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
        setEventStoryText(getGameScript(username)[`day${data.current_day}`]?.[0] || "");
        setIsEventActive(false);
        setChoices([]);
        setEventBackgroundImage(null); // 다음날로 넘어가면 이벤트 배경 제거
      } catch (error) {
        console.error("❌ Day 증가 실패:", error);
      }
    }
  };

  const onChoiceSelected = (index) => {
    const choice = choices[index];
    if (!choice) return;

    setEventStoryText(choice.result);

    // 이벤트 배경 변경
    setEventBackgroundImage(`/img/${choice.background || "background_home.png"}`);

    // 스탯 반영
    onDayIncrement(gameDay, {
      money: choice.stats.money,
      health: choice.stats.health,
      mental: choice.stats.mental,
      reputation: choice.stats.rep,
    });

    setChoices([]);
    setIsEventActive(false);
  };

  return (
    <>
      <div className="main-container">
        {/* 항상 보이는 회색 UI 배경 */}
        <img className="background-img" src={backgroundImage} alt="기본 UI 배경" />

        {/* 상황에 따라 보이는 장소 배경 */}
        {eventBackgroundImage && (
          <img className="background-home" src={eventBackgroundImage} alt="이벤트 배경" />
        )}

        <div className="game-overlay">
          <div className="game-story-text">
            <p>{eventStoryText}</p>
          </div>
        </div>
      </div>

      {/* 선택지 버튼 렌더링 */}
      <ChoiceButtons
        choices={choices}
        onChoiceSelected={onChoiceSelected}
        onNext={goToNextScript}
      />
    </>
  );
}

export default GameScreen;
