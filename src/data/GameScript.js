const gameScript = (username, stats = {}) => ({
  day1: [
    { speaker: username, text: `내이름은 ${username}. 평범한 대학생이다.` },
    { text: "그리고 오늘, 처음으로 자취를 시작하게 되었다." },
    { text: "방학 동안 편하게 쉬려고 했는데..." },
    { text: "부모님께선 나를 독립시켜버리셨다." },
    { text: "이제부터 월세, 생활비... 모든걸 스스로 해결해야한다." },
    { text: "집 안을 둘러보니, 아직은 낯설기만 한 자취방." },
    { text: "뭐, 그래도 어떻게든 되겠지?" },
    { speaker: username, text: "목표는 간단하다. 개강까지 살아남기." },
    { speaker: username, text: "그럼, 시작해볼까?" }
  ],
  day19: [
    { text: "평소와 다름없는 하루.." },
    { text: "(초인종 소리)" },
    { speaker: username, text: "??? 누구지? 오늘은 올 사람 없을텐데.." },
    { speaker: "엄마", text: `${username}~ 엄마 왔다` },
    { speaker: username, text: "...!" },
    { speaker: "엄마", text: "엄마 그냥 문 열고 들어간다~" },
    { text: "(벌컥)" },
    {
      speaker: "엄마",
      text:
        stats.health < 30
          ? "어휴, 너 이러다 병나겠다. 집도 지저분하고 얼굴도 퀭하구나..."
          : "오, 그래도 제법 잘 지내고 있었네? 엄마가 걱정 괜히 했네~"
    }
  ]
});

export default gameScript;
