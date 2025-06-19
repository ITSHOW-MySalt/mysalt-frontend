import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  isEventActive,
  setIsEventActive,
  currentScriptIndex,
  setCurrentScriptIndex,
  newsEventData,
  setNewsEventData,
  gender
}) {
  const navigate = useNavigate();
  const [usernameId, setUsernameId] = useState(null);
  const [gameScript, setGameScript] = useState({});
  const [choices, setChoices] = useState([]);
  const [eventType, setEventType] = useState(null);
  const [isJobResultVisible, setIsJobResultVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (username_id) {
      setUsernameId(username_id);
    }
  }, [username_id]);

  useEffect(() => {
    if (username) {
      const script = getGameScript(username, gender);  // gender 추가
      setGameScript(script);
    }
  }, [username, gender]);

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
    const shouldInit = !!username && !!usernameId && !!gameDay && gameDay > 0;

    if (!shouldInit) return;

    const initEvent = async () => {
      try {
        const res = await axios.get("/api/init?username=" + username);
        const initData = res.data;

        if (initData.ending_list === 1) {
          const endingRes = await axios.get("/api/check-ending", {
            params: { username },
          });

          if (endingRes.data?.ending && endingRes.data?.imglink) {
            const imgPath = `/img/${endingRes.data.imglink}`;

            setIsEnding(true);
            setEventStoryText(endingRes.data.ending);
            setEventBackgroundImage(imgPath);

            const resultChoices = await handleEventType(
              7,
              setEventStoryText,
              setIsEventActive,
              setCurrentScriptIndex,
              gameDay,
              username,
              setEventBackgroundImage,
              setNewsEventData,
              usernameId,
              endingRes.data.ending,
              imgPath,
              navigate,
              gender
            );

            setChoices(resultChoices || []);
            return;
          }
        }

        const type = await fetchEventType();
        setEventType(type);

        const jobChoices = await handleEventType(
          type,
          setEventStoryText,
          setIsEventActive,
          setCurrentScriptIndex,
          gameDay,
          username,
          setEventBackgroundImage,
          setNewsEventData,
          usernameId,
          null,
          null,
          navigate,
          gender
        );

        setChoices(jobChoices && jobChoices.length > 0 ? jobChoices : []);
      } catch (error) {
        console.error("❌ 이벤트 초기화 실패:", error);
      }
    };

    initEvent();
  }, [username, usernameId, gameDay]);

  const goToNextScript = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (eventType === 3 && isJobResultVisible) {
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
        setEventStoryText("");
        setEventBackgroundImage(null);
        setIsEventActive(false);
        setChoices([]);
        setNewsEventData(null);
        setIsJobResultVisible(false);
        return;
      }

      if (isEnding) {
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

          const resetRes = await axios.post("/api/reset-progress", { username });

          if (resetRes.status === 200) {
            alert("진행도가 초기화되고 로그아웃 됩니다.");
            localStorage.removeItem("username");

            setGameDay(1);
            setIsEnding(false);
            setEventStoryText("");
            setEventBackgroundImage(null);
            setIsEventActive(false);
            setChoices([]);
            setNewsEventData(null);

            window.location.href = "/";
            return;
          } else {
            alert("진행도 초기화에 실패했습니다.");
            return;
          }
        } catch (error) {
          console.error("❌ 엔딩 처리 중 오류:", error);
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
            const res = await axios.get(`/api/init?username=${username}`);
            const data = res.data;

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
          setEventStoryText(getGameScript(username)[`day${data.current_day}`]?.[0] || "");
          setIsEventActive(false);
          setChoices([]);
          setNewsEventData(null);
          setEventBackgroundImage(null);
        } catch (error) {
          console.error("❌ Day 증가 실패:", error);
        }
      }
    } catch (error) {
      console.error("❌ 다음 버튼 처리 실패:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onChoiceSelected = async (index) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (eventType === 7) {
        try {
          const response = await axios.post("/api/reset-progress", {
            username: username
          });

          if (response.status === 200) {
            alert("진행도가 초기화되었습니다.");
            localStorage.removeItem("username");
            navigate("/", { replace: true });
          } else {
            alert("진행도 초기화에 실패했습니다.");
          }
        } catch (error) {
          console.error("에러 발생:", error);
          alert("서버 오류가 발생했습니다.");
        }
        return;
      }

      if (eventType === 3) {
        const selectedChoice = choices[index];
        const selectedStats = selectedChoice?.stats || {
          money: 0,
          health: 0,
          mental: 0,
          reputation: 0,
        };

        await axios.post("/api/update-progress", {
          username,
          ch_stat_money: currentStats.money + selectedStats.money,
          ch_stat_health: currentStats.health + selectedStats.health,
          ch_stat_mental: currentStats.mental + selectedStats.mental,
          ch_stat_rep: currentStats.reputation + selectedStats.reputation,
        });

        setEventStoryText(selectedChoice?.result || "");
        setEventBackgroundImage(selectedChoice.background || null);
        setChoices([]);
        setIsJobResultVisible(true);
        return;
      }

      if (newsEventData || (choices.length > 0 && isEventActive)) {
        let selectedStats = null;

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

      if (choices.length > 0) {
        const selectedChoice = choices[index];
        const selectedStats = selectedChoice?.stats || {
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
    } finally {
      setIsProcessing(false);
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
            {isEventActive || isEnding ? (
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

        {/* 캐릭터 이미지는 game-overlay 밖으로 */}
        {gameScript[`day${gameDay}`] &&
         gameScript[`day${gameDay}`][currentScriptIndex]?.image && (
          <img
            src={`/img/${gameScript[`day${gameDay}`][currentScriptIndex].image}`}
            alt="캐릭터"
            className="character-img"
          />
        )}
      </div> {/* <-- main-container 닫힘 */}

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
        onNext={
          isJobResultVisible ||
          (!newsEventData &&
            choices.length === 0 &&
            gameScript[`day${gameDay}`] &&
            currentScriptIndex < gameScript[`day${gameDay}`].length)
            ? goToNextScript
            : null
        }
        onChoiceSelected={onChoiceSelected}
        disabled={isProcessing}
      />
    </>
  );
}

export default GameScreen;
