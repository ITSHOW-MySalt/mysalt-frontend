import getGameScript from "../data/GameScript";
import axios from "axios";

export async function handleEventType(
  type,
  setEventStoryText,
  setIsEventActive,
  setCurrentScriptIndex,
  gameDay,
  username,
  setBackgroundImage,
  setNewsEventData,
  username_id
) {
  const gameScriptData = getGameScript(username);

  const backgroundMap = {
    1: "background_home.png",
    2: "background_school.png",
    3: "background_street.png",
    4: "background_cafe.png",
    5: "background_library.png",
    6: "background_market.png",
  };

  const background = backgroundMap[gameDay] || "background_default.png";

  switch (type) {
    case 0: // 고정 이벤트
      console.log("📘 고정이벤트 발생");
      setIsEventActive(false);
      setBackgroundImage(`/img/${background}`);

      if (gameScriptData?.[`day${gameDay}`]?.length > 0) {
        setEventStoryText(gameScriptData[`day${gameDay}`][0]);
        setCurrentScriptIndex(0);
      } else {
        setEventStoryText("고정 스크립트를 불러오지 못했습니다.");
      }
      break;

    case 1: // 일반 이벤트
      console.log("💼 평상 이벤트 발생");
      setIsEventActive(true);
      setBackgroundImage("/img/event_normal.png");
      try {
        const res = await axios.get("/api/dialogues/normal-events");
        setEventStoryText(res.data.dialogue || "이벤트 대사 없음");
      } catch (err) {
        console.error("평상 이벤트 데이터 가져오기 실패:", err);
        setEventStoryText("이벤트 로드 실패...");
      }
      break;

    case 3: // 알바 이벤트
      console.log("🏥 알바 이벤트 발생");
      setIsEventActive(true);
      setBackgroundImage(`/img/${background}`);
      setEventStoryText("오늘은 알바하는 날이다. 무슨 알바를 할까?");
      setCurrentScriptIndex(0);

      try {
        const res = await axios.get(`/api/dialogues/job-choices`);
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

        const getRandomChoices = (arr, num) => {
          const shuffled = arr.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, num);
        };

        const jobChoices = getRandomChoices(allChoices, 2);
        console.log("✅ 랜덤 선택지 2개:", jobChoices);
        return jobChoices; // ✅ 여기서 return 후 끝
      } catch (error) {
        console.error("❌ 알바 선택지 불러오기 실패:", error);
        setEventStoryText("알바 선택지를 불러오는 데 실패했습니다.");
        return [];
      }

    case 4: // 뉴스 이벤트
      console.log("📰 뉴스 이벤트 발생");
      console.log("userid:", username_id);
      setIsEventActive(true);

      try {
        const response = await axios.get("/api/events/news", {
          params: { username_id: username_id }, // ✅ 수정된 userId 전달
        });

        const news = response.data;

        if (news) {
          setEventStoryText(news.dialogue);
          setNewsEventData(news);
          setBackgroundImage(`/img/${news.background}`);
        } else {
          setEventStoryText("뉴스 이벤트를 불러올 수 없습니다.");
          setBackgroundImage("/img/background_home.png");
        }
      } catch (error) {
        console.error("뉴스 이벤트 불러오기 실패:", error);
        setEventStoryText("뉴스 이벤트 로드 실패...");
        setBackgroundImage("/img/background_home.png");
      }
      break;

    case 5: // 주말 이벤트
      console.log("🎉 주말 이벤트 발생");
      setIsEventActive(true);
      setBackgroundImage("/img/event_weekend.png");
      setEventStoryText("즐거운 주말입니다!");
      break;

    case 6: // 엔딩
      console.log("🎬 엔딩 도달");
      setIsEventActive(true);
      setBackgroundImage("/img/event_ending.png");
      setEventStoryText("게임 엔딩에 도달했습니다!");
      break;

    default:
      console.warn("⚠️ 알 수 없는 이벤트 타입입니다:", type);
      setIsEventActive(false);
      setBackgroundImage("/img/background_gray.png");
      setEventStoryText("알 수 없는 이벤트 타입입니다.");
      break;
  }

  return [];
}
