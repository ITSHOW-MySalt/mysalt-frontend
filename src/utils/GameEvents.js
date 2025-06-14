import getGameScript from "../data/GameScript";
import axios from "axios";

export async function handleEventType(
  type,
  setEventStoryText,
  setIsEventActive,
  setCurrentScriptIndex,
  gameDay,
  username,
  setBackgroundImage
) {
  const gameScriptData = getGameScript(username);

  const backgroundMap = {
    1: "background_room.png",
    2: "background_school.png",
    3: "background_street.png",
    4: "background_cafe.png",
    5: "background_library.png",
    6: "background_market.png",
  };

  const background = backgroundMap[gameDay] || "background_default.png";

  switch (type) {
    case 0:
      console.log("고정이벤트 발생");
      setIsEventActive(false);
      setBackgroundImage(`/img/${background}`);

      if (gameScriptData?.[`day${gameDay}`]?.length > 0) {
        setEventStoryText(gameScriptData[`day${gameDay}`][0]);
        setCurrentScriptIndex(0);
      } else {
        setEventStoryText("고정 스크립트를 불러오지 못했습니다.");
      }
      break;

    case 1:
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

    setBackgroundImage(`/img/${backgroundMap[gameDay] || "background_default.png"}`);
    setEventStoryText("오늘은 알바하는 날이다. 무슨 알바를 할까?");
    setCurrentScriptIndex(0);

    try {
      const res = await axios.get(`/api/dialogues/job-choices`);
      console.log("✅ API 응답 성공:", res.data);

      // 전체 선택지 중 2개 랜덤 추출
      const allChoices = res.data.map((c) => ({
        text: c.choiceText,
        result: c.resultDialogue,
        stats: {
          money: c.chStatMoney,
          health: c.chStatHealth,
          mental: c.chStatMental,
          rep: c.chStatRep,
        },
        background: c.background,
      }));

      // 랜덤 2개 추출 함수
      function getRandomChoices(arr, num) {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
      }

      const jobChoices = getRandomChoices(allChoices, 2);

      console.log("✅ 랜덤 선택지 2개:", jobChoices);

      return jobChoices;
    } catch (error) {
      console.error("❌ 알바 선택지 불러오기 실패:", error);
      setEventStoryText("알바 선택지를 불러오는 데 실패했습니다.");
      return [];
    }

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
