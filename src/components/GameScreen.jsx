import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleEventType } from "../utils/GameEvents";
import getGameScript from "../data/GameScript";
import "../styles/GameScreen.css";
import ChoiceButtons from "./ChoiceButtons";

function GameScreen({
  username,
  username_id,
  gameDay,
  setGameDay,
  onDayIncrement,
  currentStats,
  isEnding,
  eventStoryText,
  eventBackgroundImage,
  setIsEnding,
  setEventStoryText,
  setEventBackgroundImage,
  checkEnding,
  isEventActive,
  setIsEventActive,
  currentScriptIndex,
  setCurrentScriptIndex,
  newsEventData,
  setNewsEventData,
}) {
  const [usernameId, setUsernameId] = useState(null);
  const [gameScript, setGameScript] = useState({});
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    if (username_id) {
      setUsernameId(username_id);
    }
  }, [username_id]);

  useEffect(() => {
    if (username) {
      const script = getGameScript(username);
      setGameScript(script);
    }
  }, [username]);

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

  const goToNextScript = async () => {
    try {
      if (isEnding) {
        // 진행도 초기화 요청
        const res = await axios.post("/api/reset-progress", { username });
        if (res.status === 200) {
          alert("진행도가 초기화되고 로그아웃 됩니다.");

          // 클라이언트 측 로그아웃 처리
          localStorage.removeItem("username");

          // 상태 초기화
          setGameDay(1);
          setIsEnding(false);
          setEventStoryText("");
          setEventBackgroundImage(null);
          setIsEventActive(false);
          setChoices([]);
          setNewsEventData(null);

          // 페이지 강제 이동 (루트 페이지)
          window.location.href = "/";
          return;
        } else {
          alert("진행도 초기화에 실패했습니다.");
          return;
        }
      }

      const dayKey = `day${gameDay}`;
      const currentDayScript = gameScript[dayKey];
      const nextIndex = currentScriptIndex + 1;

      if (!isEventActive) {
        if (currentDayScript && nextIndex < currentDayScript.length) {
          setCurrentScriptIndex(nextIndex);
          setEventStoryText("");
        } else {
          try {
            await axios.post("/api/next-day", { username });

            // 서버에서 최신 상태 받아오기
            const res = await axios.get(`/api/init?username=${username}`);
            const data = res.data;

            // 서버에서 받은 상태로 갱신
            await onDayIncrement(data.current_day, {
              money: data.ch_stat_money - currentStats.money,
              health: data.ch_stat_health - currentStats.health,
              mental: data.ch_stat_mental - currentStats.mental,
              reputation: data.ch_stat_rep - currentStats.reputation,
            });

            setCurrentScriptIndex(0);
            setEventStoryText("");
            setIsEventActive(false);
            setChoices([]);
            setNewsEventData(null);
            setEventBackgroundImage(null);
          } catch (error) {
            console.error("❌ Day 증가 실패:", error);
          }
        }
      } else {
        // 이벤트 활성 상태일 때도 동일하게 처리
        try {
          await axios.post("/api/next-day", { username });

          const res = await axios.get(`/api/init?username=${username}`);
          const data = res.data;

          await onDayIncrement(data.current_day, {
            money: data.ch_stat_money - currentStats.money,
            health: data.ch_stat_health - currentStats.health,
            mental: data.ch_stat_mental - currentStats.mental,
            reputation: data.ch_stat_rep - currentStats.reputation,
          });

          setCurrentScriptIndex(0);
          setEventStoryText(
            getGameScript(username)[`day${data.current_day}`]?.[0] || ""
          );
          setEventStoryText("");
          setIsEventActive(false);
          setChoices([]);
          setNewsEventData(null);
          setEventBackgroundImage(null);

          if (checkEnding) {
            await checkEnding();
          }
        } catch (error) {
          console.error("❌ Day 증가 실패:", error);
        }
      }
    } catch (error) {
      console.error("❌ 다음 버튼 처리 실패:", error);
    }
  };

  const onChoiceSelected = async (index) => {
    try {
      let selectedStats = null;

      if (newsEventData || (choices.length > 0 && isEventActive)) {
        if (newsEventData) {
          selectedStats =
            index === 0
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
        } else {
          selectedStats = choices[index]?.stats || {
            money: 0,
            health: 0,
            mental: 0,
            reputation: 0,
          };
        }

        await axios.post("/api/update-progress", {
          username,
          ch_stat_money: currentStats.money + selectedStats.money,
          ch_stat_health: currentStats.health + selectedStats.health,
          ch_stat_mental: currentStats.mental + selectedStats.mental,
          ch_stat_rep: currentStats.reputation + selectedStats.reputation,
        });

        // 서버에서 최신 상태 받아오기
        const res = await axios.get(`/api/init?username=${username}`);
        const data = res.data;

        await onDayIncrement(data.current_day, {
          money: data.ch_stat_money - currentStats.money,
          health: data.ch_stat_health - currentStats.health,
          mental: data.ch_stat_mental - currentStats.mental,
          reputation: data.ch_stat_rep - currentStats.reputation,
        });

        await goToNextScript();
        return;
      }

      // 알바 등 이벤트 (선택지 누른 후 결과 보여주고 isEventActive 끄기)
      if (choices.length > 0) {
        const selectedChoice = choices[index];

        selectedStats = selectedChoice?.stats || {
          money: 0,
          health: 0,
          mental: 0,
          reputation: 0,
        };

        setEventStoryText(selectedChoice?.result || "");
        setIsEventActive(false);
        setChoices([]);
        setEventBackgroundImage(selectedChoice.background || null);

        await axios.post("/api/update-progress", {
          username,
          ch_stat_money: currentStats.money + selectedStats.money,
          ch_stat_health: currentStats.health + selectedStats.health,
          ch_stat_mental: currentStats.mental + selectedStats.mental,
          ch_stat_rep: currentStats.reputation + selectedStats.reputation,
        });

        // 서버에서 최신 상태 받아오기
        const res = await axios.get(`/api/init?username=${username}`);
        const data = res.data;

        await onDayIncrement(data.current_day, {
          money: data.ch_stat_money - currentStats.money,
          health: data.ch_stat_health - currentStats.health,
          mental: data.ch_stat_mental - currentStats.mental,
          reputation: data.ch_stat_rep - currentStats.reputation,
        });
      }
    } catch (error) {
      console.error("❌ 선택지 처리 실패:", error);
    }
  };

  return (
    <>
      <div className="main-container">
        <img
          className="background-img"
          src={"/img/background_gameUi.png"}
          alt="기본 UI 배경"
        />
        {eventBackgroundImage && (
          <img
            className="background-home"
            src={eventBackgroundImage}
            alt="이벤트 배경"
          />
        )}

        <div className="game-overlay">
          <div className="game-story-text">
            {isEventActive ? (
              <p>{eventStoryText}</p>
            ) : isEnding ? (
              <p>{eventStoryText}</p>
            ) : (
              gameScript[`day${gameDay}`] &&
              gameScript[`day${gameDay}`][currentScriptIndex] && (
                <>
                  {gameScript[`day${gameDay}`][currentScriptIndex].speaker && (
                    <p className="speaker">
                      {gameScript[`day${gameDay}`][currentScriptIndex].speaker}
                    </p>
                  )}
                  <p>{gameScript[`day${gameDay}`][currentScriptIndex].text}</p>
                </>
              )
            )}
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
