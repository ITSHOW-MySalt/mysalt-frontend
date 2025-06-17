import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleEventType } from "../utils/GameEvents";
import getGameScript from "../data/GameScript";
import "../styles/GameScreen.css";
import ChoiceButtons from "./ChoiceButtons";

function GameScreen({ username, gameDay, onDayIncrement }) {
  const [usernameId, setUsernameId] = useState(null); // ✅ username_id 저장용
  const [gameScript, setGameScript] = useState({});
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [eventStoryText, setEventStoryText] = useState("");
  const [isEventActive, setIsEventActive] = useState(false);
  const [choices, setChoices] = useState([]);
  const [newsEventData, setNewsEventData] = useState(null);
  const [backgroundImage] = useState("/img/background_gameUi.png");
  const [eventBackgroundImage, setEventBackgroundImage] = useState(null);

  // ✅ 사용자 ID 불러오기
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(`/api/user/id?username=${username}`);
        setUsernameId(res.data.userId); // 예: { userId: 123 }
      } catch (error) {
        console.error("❌ 사용자 ID 불러오기 실패:", error);
      }
    };

    if (username) fetchUserId();
  }, [username]);

  // ✅ 이벤트 초기화
  useEffect(() => {
    if (!username || !usernameId || gameDay === 0) return;

    const initEvent = async () => {
      const type = await fetchEventType();

      const jobChoices = await handleEventType(
        type,
        setEventStoryText,
        setIsEventActive,
        setCurrentScriptIndex,
        gameDay,
        username,
        setEventBackgroundImage,
        setNewsEventData,
        16
      );

      if (jobChoices && jobChoices.length > 0) {
        setChoices(jobChoices);
      } else {
        setChoices([]);
      }
    };

    initEvent();
  }, [username, usernameId, gameDay]);

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
        setNewsEventData(null);
        setEventBackgroundImage(null);
      } catch (error) {
        console.error("❌ Day 증가 실패:", error);
      }
    }
  };

  const onChoiceSelected = (index) => {
    if (newsEventData) {
      const selected = index === 0 ? {
        money: newsEventData.ch_stat1_money,
        health: newsEventData.ch_stat1_health,
        mental: newsEventData.ch_stat1_mental,
        reputation: newsEventData.ch_stat1_rep,
      } : {
        money: newsEventData.ch_stat2_money,
        health: newsEventData.ch_stat2_health,
        mental: newsEventData.ch_stat2_mental,
        reputation: newsEventData.ch_stat2_rep,
      };

      const resultText = index === 0 ? "선택 1을 골랐습니다!" : "선택 2를 골랐습니다!";
      setEventStoryText(resultText);

      onDayIncrement(gameDay, selected);
      setNewsEventData(null);
      setIsEventActive(false);
      return;
    }

    const choice = choices[index];
    if (!choice) return;

    setEventStoryText(choice.result);
    setEventBackgroundImage(`/img/${choice.background || "background_home.png"}`);

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
        <img className="background-img" src={backgroundImage} alt="기본 UI 배경" />
        {eventBackgroundImage && (
          <img className="background-home" src={eventBackgroundImage} alt="이벤트 배경" />
        )}

        <div className="game-overlay">
          <div className="game-story-text">
            <p>{eventStoryText}</p>
          </div>
        </div>
      </div>

      <ChoiceButtons
        choices={
          newsEventData
            ? [
                { text: newsEventData.choice1 },
                { text: newsEventData.choice2 },
              ]
            : choices
        }
        onChoiceSelected={onChoiceSelected}
        onNext={goToNextScript}
      />
    </>
  );
}

export default GameScreen;
