import axios from "axios";
import heroineScript from "../data/heroineScript";
import getGameScript from "../data/GameScript";

export async function handleChoiceSelected({
  index,
  eventType,
  choices,
  currentStats,
  username,
  usernameId,
  currentScriptIndex,
  heroineType,
  heroineMeetingCount,
  gender,
  newsEventData,
  onDayIncrement,
  setEventStoryText,
  setEventBackgroundImage,
  setIsJobResultVisible,
  setChoices,
  setIsEventActive,
  setCurrentScriptIndex,
  setHeroineType,
  setIsProcessing,
  navigate,
  goToNextScript,
}) {
  const selectedChoice = choices[index];
  const selectedStats = selectedChoice?.stats || {
    money: 0,
    health: 0,
    mental: 0,
    reputation: 0,
  };

  if (eventType === 7) {
    try {
      const response = await axios.post("/api/reset-progress", { username });
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
    setIsProcessing(false);
    return;
  }

  if (eventType === 3) {
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
    setIsProcessing(false);
    return;
  }

  if (eventType === 4 || eventType === 1) {
    setEventStoryText(selectedChoice?.result || "");
    if (eventType === 4) {
      setEventBackgroundImage(selectedChoice.background || null);
    }
    setChoices([]);
    setIsEventActive(false);

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

    setIsProcessing(false);
    return;
  }

  if (eventType === 5) {
    // 1단계: 외출 or 쉼
    if (selectedChoice.next === "goOut") {
      setChoices([
        { text: "카페", next: "A" },
        { text: "공원", next: "B" },
      ]);
      setEventStoryText("어디로 갈까?");
      setIsEventActive(true);
      setCurrentScriptIndex(0);
      setIsProcessing(false);
      return;
    }

    if (selectedChoice.next === "rest") {
      setEventStoryText("오늘은 그냥 푹 쉬었다.");
      setChoices([]);
      setIsJobResultVisible(true);

      await axios.post("/api/update-progress", {
        username,
        ch_stat_health: currentStats.health + 10,
        ch_stat_mental: currentStats.mental + 5,
        ch_stat_money: currentStats.money + 10,
        ch_stat_rep: currentStats.reputation - 5,
      });

      setIsProcessing(false);
      return;
    }

    // 2단계: A/B 히로인 만남
    if (selectedChoice.next === "A" || selectedChoice.next === "B") {
      const heroine = selectedChoice.next;
      setHeroineType(heroine);

      await axios.post(`/api/heroin/${usernameId}/meet`, null, {
        params: { target: heroine },
      });

      const res = await axios.get(`/api/heroin/${usernameId}`);
      const data = res.data;
      const currentAffection =
        heroine === "A" ? data.heroinA_affection : data.heroinB_affection;

      const affectionGain = selectedChoice.affection || 0;
      const moneyChange = selectedChoice.money || 0;

      await axios.post(`/api/heroin/${usernameId}/affection`, null, {
        params: { target: heroine, amount: affectionGain },
      });

      await axios.post("/api/update-progress", {
        username,
        ch_stat_money: currentStats.money + moneyChange,
        ch_stat_health: currentStats.health,
        ch_stat_mental: currentStats.mental,
        ch_stat_rep: currentStats.reputation,
      });

      const dialogue = heroineScript(
        heroine,
        currentAffection + affectionGain,
        username,
        gender
      );

      setEventStoryText(dialogue[0]);
      setCurrentScriptIndex(0);
      setChoices(dialogue[0].choices || []);
      setIsEventActive(true);
      setIsProcessing(false);
      return;
    }

    // 3단계: 대화 흐름 중 nextIndex 처리
    if (heroineType) {
      const dialogue = heroineScript(heroineType, heroineMeetingCount, username);

      if (typeof selectedChoice.nextIndex === "number") {
        const nextIndex = selectedChoice.nextIndex;
        if (nextIndex < dialogue.length) {
          setCurrentScriptIndex(nextIndex);
          setEventStoryText(dialogue[nextIndex]);
          setChoices(dialogue[nextIndex].choices || []);
          setIsEventActive(true);
        } else {
          setIsEventActive(false);
          setChoices([]);
          setEventStoryText("");
          setCurrentScriptIndex(0);
          setHeroineType(null);
        }

        setIsProcessing(false);
        return;
      }
    }
  }

  setEventStoryText(selectedChoice?.result || "");
  setIsEventActive(false);
  setChoices([]);

  if (eventType === 3) {
    setEventBackgroundImage(selectedChoice.background || null);
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

  setIsProcessing(false);
}
