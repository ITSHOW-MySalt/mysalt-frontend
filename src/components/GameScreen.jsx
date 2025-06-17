// GameScreen.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleEventType } from "../utils/GameEvents";
import getGameScript from "../data/GameScript";
import "../styles/GameScreen.css";
import ChoiceButtons from "./ChoiceButtons";

function GameScreen({ username, gameDay, onDayIncrement, currentStats }) {
  const [usernameId, setUsernameId] = useState(null);
  const [gameScript, setGameScript] = useState({});
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [eventStoryText, setEventStoryText] = useState("");
  const [isEventActive, setIsEventActive] = useState(false);
  const [choices, setChoices] = useState([]);
  const [newsEventData, setNewsEventData] = useState(null);
  const [backgroundImage] = useState("/img/background_gameUi.png");
  const [eventBackgroundImage, setEventBackgroundImage] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(`/api/user/id?username=${username}`);
        setUsernameId(res.data.userId);
      } catch (error) {
        console.error("❌ 사용자 ID 불러오기 실패:", error);
      }
    };

    if (username) fetchUserId();
  }, [username]);

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
        usernameId
      );

      setChoices(jobChoices && jobChoices.length > 0 ? jobChoices : []);
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

        const delta = {
          money: 0,
          health: 0,
          mental: 0,
          reputation: 0,
        };

        await onDayIncrement(data.current_day, delta); // 변화 없음

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

  const onChoiceSelected = async (index) => {
    try {
      let selectedStats = null;
      let resultText = "";

      if (newsEventData) {
        selectedStats = index === 0
          ? {
              money: newsEventData.ch_stat1_money || 0,
              health: newsEventData.ch_stat1_health || 0,
              mental: newsEventData.ch_stat1_mental || 0,
              reputation: newsEventData.ch_stat1_rep || 0,
            }
          : {
              money: newsEventData.ch_stat2_money || 0,
              health: newsEventData.ch_stat2_health || 0,
              mental: newsEventData.ch_stat2_mental || 0,
              reputation: newsEventData.ch_stat2_rep || 0,
            };
        resultText = index === 0 ? newsEventData.result1 : newsEventData.result2;

      } else if (choices.length > 0) {
        const selectedChoice = choices[index];

        selectedStats = selectedChoice?.stats || {
          money: 0,
          health: 0,
          mental: 0,
          reputation: 0,
        };

        resultText = selectedChoice?.result || "";

        // ✅ 여기 추가: 배경 이미지 반영
        if (selectedChoice?.background) {
          setEventBackgroundImage(selectedChoice.background);
        }
      }

      if (selectedStats) {
        await axios.post("/api/update-progress", {
          username,
          ch_stat_money: currentStats.money + selectedStats.money,
          ch_stat_health: currentStats.health + selectedStats.health,
          ch_stat_mental: currentStats.mental + selectedStats.mental,
          ch_stat_rep: currentStats.reputation + selectedStats.reputation,
        });

        await onDayIncrement(gameDay, selectedStats);
      }

      setChoices([]);
      setIsEventActive(false);
      if (resultText) setEventStoryText(resultText);
      if (newsEventData) {
        setNewsEventData(null);
        await goToNextScript();
      }
    } catch (error) {
      console.error("❌ 선택지 처리 실패:", error);
    }
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
                {
                  text: newsEventData.choice1,
                  stats: {
                    money: newsEventData.ch_stat1_money || 0,
                    health: newsEventData.ch_stat1_health || 0,
                    mental: newsEventData.ch_stat1_mental || 0,
                    reputation: newsEventData.ch_stat1_rep || 0,
                  },
                  result: newsEventData.result1 || "",
                },
                {
                  text: newsEventData.choice2,
                  stats: {
                    money: newsEventData.ch_stat2_money || 0,
                    health: newsEventData.ch_stat2_health || 0,
                    mental: newsEventData.ch_stat2_mental || 0,
                    reputation: newsEventData.ch_stat2_rep || 0,
                  },
                  result: newsEventData.result2 || "",
                },
              ]
            : choices
        }
        onChoiceSelected={onChoiceSelected}
        onNext={!newsEventData ? goToNextScript : null}
      />
    </>
  );
}

export default GameScreen;
