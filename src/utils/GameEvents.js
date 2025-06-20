import getGameScript from "../data/GameScript";
import axios from "axios";


function getBackgroundImagePath(name) {
  return name ? `/img/background_${name}.png` : "/img/background_home.png";
}

export async function handleEventType(
  type,
  setEventStoryText,
  setIsEventActive,
  setCurrentScriptIndex,
  gameDay,
  username,
  setBackgroundImage,
  setNewsEventData,
  username_id,
  endingName = null,
  endingImage = null,
  navigate,
  gender,
  setHeroineMeetingCount,
  setChoices
) {


  const gameScriptData = getGameScript(username, gender);

  const dayBackgroundMap = {
    1: "home",
    2: "outside",
    3: "restaurant",
    4: "cafe",
    5: "weddinghall",
    6: "warehouse",
  };

  const backgroundName = dayBackgroundMap[gameDay] || "home";

  switch (type) {
    case 0: // 고정 이벤트
      console.log("📘 고정이벤트 발생");
      setIsEventActive(false);
      setBackgroundImage(getBackgroundImagePath(backgroundName));

      if (gameScriptData?.[`day${gameDay}`]?.length > 0) {
        setEventStoryText(gameScriptData[`day${gameDay}`][0]);
        setCurrentScriptIndex(0);
      } else {
        setEventStoryText("고정 스크립트를 불러오지 못했습니다.");
      }
      break;

    case 1: // 일반 이벤트
      setIsEventActive(true);
      try {
        const res = await axios.get("/api/dialogues/normal-events");
        const eventData = res.data;

        setEventStoryText(eventData.dialogue || "이벤트 대사 없음");
        setBackgroundImage(
          eventData.background
            ? `/img/background_${eventData.background}.png`
            : "/img/background_home.png"
        );

        console.log("eventData:", eventData);

        return [
          {
            text: eventData.choice1 || "선택지1",
            stats: {
              money: eventData.ch_stat1_Money || 0,
              health: eventData.ch_stat1_Health || 0,
              mental: eventData.ch_stat1_Mental || 0,
              reputation: eventData.ch_stat1_Rep || 0,
            },
            result: eventData.result1 || "",
          },
          {
            text: eventData.choice2 || "선택지2",
            stats: {
              money: eventData.ch_stat2_Money || 0,
              health: eventData.ch_stat2_Health || 0,
              mental: eventData.ch_stat2_Mental || 0,
              reputation: eventData.ch_stat2_Rep || 0,
            },
            result: eventData.result2 || "",
          },
        ];
      } catch (err) {
        setEventStoryText("이벤트 로드 실패...");
        setBackgroundImage("/img/background_home.png");
      }
      break;

    case 3: // 알바 이벤트
      console.log("🏥 알바 이벤트 발생");
      setIsEventActive(true);
      setBackgroundImage(getBackgroundImagePath("home"));
      setEventStoryText("오늘은 알바하는 날이다. 무슨 알바를 할까?");
      setCurrentScriptIndex(0);

      try {
        const res = await axios.get("/api/dialogues/job-choices");
        const allChoices = res.data.map((c) => ({
          text: c.choiceText,
          result: c.resultDialogue,
          stats: {
            money: c.chStatMoney,
            health: c.chStatHealth,
            mental: c.chStatMental,
            reputation: c.chStatRep,
          },
          background: getBackgroundImagePath(c.background),
          id: c.id,
        }));

        const getRandomChoices = (arr, num) => {
          const shuffled = arr.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, num);
        };

        const jobChoices = getRandomChoices(allChoices, 2);
        console.log("✅ 랜덤 선택지 2개:", jobChoices);
        return jobChoices;
      } catch (error) {
        console.error("❌ 알바 선택지 불러오기 실패:", error);
        setEventStoryText("알바 선택지를 불러오는 데 실패했습니다.");
      }
      break;

    case 4: // 뉴스 이벤트
      console.log("📰 뉴스 이벤트 발생");
      console.log("userid:", username_id);
      setIsEventActive(true);

      try {
        const response = await axios.get("/api/events/news", {
          params: { username_id: username_id },
        });

        const news = response.data;

        if (news) {
          setEventStoryText(news.dialogue);
          setNewsEventData(news);
          setBackgroundImage(getBackgroundImagePath(news.background));
        } else {
          setEventStoryText("뉴스 이벤트를 불러올 수 없습니다.");
          setBackgroundImage(getBackgroundImagePath("home"));
        }
      } catch (error) {
        console.error("뉴스 이벤트 불러오기 실패:", error);
        setEventStoryText("뉴스 이벤트 로드 실패...");
        setBackgroundImage(getBackgroundImagePath("home"));
      }
      break;

case 5: // 히로인 이벤트
  console.log("💘 히로인 이벤트 발생");
  setIsEventActive(true);
  setBackgroundImage(getBackgroundImagePath("home"));

  try {
    const res = await axios.get(`/api/heroin/${username_id}`);
    const data = res.data;
    const count = (data.heroinA_meetCount || 0) + (data.heroinB_meetCount || 0);
    setHeroineMeetingCount(count);

    const choices = [
          { text: "놀러 나간다", next: "goOut" },
          { text: "집에서 쉰다", next: "rest" },
        ];
        setEventStoryText("오늘은 주말이다. 밖으로 나갈까?");
        setChoices(choices);
        return choices;
  } catch (err) {
    console.error("❌ 히로인 만남 수 불러오기 실패:", err);
    setEventStoryText("히로인 이벤트 오류 발생...");
  }
  break;



    case 6: // 노말
      console.log("🎬 엔딩 도달");
      setIsEventActive(true);
      setBackgroundImage("/img/event_ending.png");
      setEventStoryText("게임 엔딩에 도달했습니다!");
      break;

      case 7: // 베드엔딩 또는 엔딩 후 초기화
        console.log("🔁 엔딩 후 초기화 이벤트");
        setIsEventActive(true);

        if (endingImage.includes("Common")) {
          setEventStoryText(endingName ? `엔딩: ${endingName}` : "게임 엔딩에 도달했습니다!");
          setBackgroundImage(endingImage);
          console.log("무성 엔딩 이미지:", endingImage);
        } else {
          const genderPrefix = gender === 1 ? "Female" : "Male";
          setEventStoryText(endingName ? `엔딩: ${endingName}` : "게임 엔딩에 도달했습니다!");
          setBackgroundImage(`${genderPrefix}${endingImage}`);
          console.log("성별 기반 이미지:", `${genderPrefix}${endingImage}`);
        }

        return [
          {
            text: "로그아웃 및 진행도 초기화",
            stats: { money: 0, health: 0, mental: 0, reputation: 0 },
            result: "",
          },
        ];

    default:
      console.warn("⚠️ 알 수 없는 이벤트 타입입니다:", type);
      setIsEventActive(false);
      setBackgroundImage("/img/background_gray.png");
      setEventStoryText("알 수 없는 이벤트 타입입니다.");
      break;
  }

  return [];
}