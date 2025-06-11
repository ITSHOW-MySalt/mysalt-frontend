import React, { useEffect, useState } from "react";
import { handleEventType } from "../utils/GameEvents";
import getGameScript from "../data/GameScript";
import "../styles/GameScreen.css";
import ChoiceButtons from "./ChoiceButtons";

function GameScreen({ username, gameDay }) {
  const [gameScript, setGameScript] = useState({});
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [eventStoryText, setEventStoryText] = useState("");
  const [isEventActive, setIsEventActive] = useState(false);
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    if (!username || gameDay === 0) return;

    const initEvent = async () => {
      await handleEventType(
        await fetchEventType(),
        setEventStoryText,
        setIsEventActive,
        setCurrentScriptIndex,
        gameDay,
        username
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

  const goToNextScript = () => {
    const dayKey = `day${gameDay}`;
    const currentDayScript = gameScript[dayKey];
    const nextIndex = currentScriptIndex + 1;

    if (currentDayScript && nextIndex < currentDayScript.length) {
      setCurrentScriptIndex(nextIndex);
      setEventStoryText(currentDayScript[nextIndex]);
    } else {
      console.log("📘 더 이상 다음 대사가 없습니다.");
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
          src={process.env.PUBLIC_URL + "/img/background_gray.png"}
          alt="게임 배경"
        />
        <img
          className="background-home"
          src={process.env.PUBLIC_URL + "/img/background_home.png"}
          alt="집 배경"
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
