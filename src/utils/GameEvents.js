// utils/GameEvents.js
import getGameScript from "../data/GameScript";
import axios from "axios";

export async function handleEventType(
  type,
  setEventStoryText,
  setIsEventActive,
  setCurrentScriptIndex,
  gameDay,
  username
) {
  const gameScriptData = getGameScript(username);

  switch (type) {
    case 0: // 튜토리얼 & 고정이벤트
      console.log("고정이벤트 발생");
      setIsEventActive(false);

      if (gameScriptData?.day1?.length > 0) {
        setEventStoryText(gameScriptData.day1[0]);
        setCurrentScriptIndex(0);
      } else {
        setEventStoryText("고정 스크립트를 불러오지 못했습니다.");
      }
      break;

    case 1: // 평상 이벤트
      console.log("💼 평상 이벤트 발생");
      setIsEventActive(true);
      try {
        const res = await axios.get("/api/dialogues/normal-events");
        setEventStoryText(res.data.dialogue || "이벤트 대사 없음");
      } catch (err) {
        console.error("평상 이벤트 데이터 가져오기 실패:", err);
        setEventStoryText("이벤트 로드 실패...");
      }
      break;

    case 3:
      console.log("🏥 알바 이벤트 발생");
      setIsEventActive(true);
      setEventStoryText("오늘은 알바하는 날입니다!");
      break;

    case 4:
      console.log("🎭 뉴스 이벤트 발생");
      setIsEventActive(true);
      setEventStoryText("뉴스 이벤트 발생");
      break;

    case 5:
      console.log("🎉 주말 이벤트 발생");
      setIsEventActive(true);
      setEventStoryText("즐거운 주말입니다!");
      break;

    case 6:
      console.log("🎬 엔딩 도달");
      setIsEventActive(true);
      setEventStoryText("게임 엔딩에 도달했습니다!");
      break;

    default:
      console.warn("⚠️ 알 수 없는 이벤트 타입입니다:", type);
      setIsEventActive(false);
      setEventStoryText("알 수 없는 이벤트 타입입니다.");
      break;
  }
}

// 👇 goToNextScript 헬퍼 함수 추가
export function goToNextScriptHelper({
  gameScript,
  gameDay,
  currentScriptIndex,
  setCurrentScriptIndex,
  setEventStoryText,
}) {
  const dayKey = `day${gameDay}`;
  const currentDayScript = gameScript?.[dayKey];
  const nextIndex = currentScriptIndex + 1;

  if (currentDayScript && nextIndex < currentDayScript.length) {
    setCurrentScriptIndex(nextIndex);
    setEventStoryText(currentDayScript[nextIndex]);
  } else {
    console.log("📘 더 이상 다음 대사가 없습니다.");
    setEventStoryText("오늘의 이야기는 여기까지입니다.");
  }
}