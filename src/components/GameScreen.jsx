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
  const [backgroundImage, setBackgroundImage] = useState("/img/background_gray.png");

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
        setBackgroundImage
      );

      // 선택지가 반환되었을 경우
      if (jobChoices && jobChoices.length > 0) {
        console.log("✅ [GameScreen] 선택지 받아옴:", jobChoices);
        setChoices(jobChoices);
      } else {
        setChoices([]);
        console.log("✅실패다용");
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
        setChoices([]); // 새 날 시작 시 선택지 초기화
      } catch (error) {
        console.error("❌ Day 증가 실패:", error);
      }
    }
  };

 const onChoiceSelected = (index) => {
   console.log("🎯 선택지 선택됨:", index);
   const choice = choices[index];
   if (!choice) return;

   // 선택 결과 대사 업데이트
   setEventStoryText(choice.result);

   // 배경 업데이트 (이미지 경로에 맞게 조정 필요)
   setBackgroundImage(`/img/${choice.background || 'background_gray.png'}`);

   // 스탯 반영 (예시)
   onDayIncrement(gameDay, {
     money: choice.stats.money,
     health: choice.stats.health,
     mental: choice.stats.mental,
     reputation: choice.stats.rep,
   });

   // 선택지 닫기
   setChoices([]);

   // 이벤트 계속할지 여부 판단 가능
   setIsEventActive(false);
 };


  return (
    <>
      <div className="main-container">
        <img className="background-img" src={backgroundImage} alt="게임 배경" />
        <div className="game-overlay">
          <div className="game-story-text">
            <p>{eventStoryText}</p>
          </div>
        </div>
      </div>

      {/* ✅ 조건에 따라 정확하게 버튼 렌더링 */}
      {choices.length > 0 && isEventActive && (
        <ChoiceButtons
          choices={choices}
          onChoiceSelected={onChoiceSelected}
          onNext={goToNextScript}
        />
      )}

      {choices.length === 0 && !isEventActive && (
        <ChoiceButtons
          choices={[]}
          onChoiceSelected={onChoiceSelected}
          onNext={goToNextScript}
        />
      )}
    </>
  );
}

export default GameScreen;
