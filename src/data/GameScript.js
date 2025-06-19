const gameScript = (username, gender) => ({
  day1: [
    {
      speaker: username,
      text: `내 이름은 ${username}. 평범한 대학생이다.`,
      image: gender === 1 ? "Female_neutral.png" : "Male_neutral.png",
    },
    { text: "그리고 오늘, 처음으로 자취를 시작하게 되었다." },
    { text: "방학 동안 편하게 쉬려고 했는데..." },
    { text: "부모님께선 나를 독립시켜버리셨다." },
    { text: "이제부터 월세, 생활비... 모든 걸 스스로 해결해야 한다." },
    { text: "집 안을 둘러보니, 아직은 낯설기만 한 자취방." },
    { text: "뭐, 그래도 어떻게든 되겠지?" },
    {
      speaker: username,
      text: "목표는 간단하다. 35일 동안, 살아남기.",
      image: gender === 1 ? "Female_neutral.png" : "Male_neutral.png",
    },
    { speaker: username, text: "그럼, 시작해볼까?" ,
      image: gender === 1 ? "Female_neutral.png" : "Male_neutral.png",},
  ],

  day19: [
    { text: "평소와 다름없는 하루.." },
    { text: "(초인종 소리)" },
    { speaker: username, text: "??? 누구지? 오늘은 올 사람 없을 텐데.." },
    { speaker: "엄마", text: `${username}~ 엄마 왔다` },
    { speaker: username, text: "...!" },
    { speaker: "엄마", text: "엄마 그냥 문 열고 들어간다~" },
    { text: "(벌컥)" },
    {
      speaker: "엄마",
      text: "오, 그래도 제법 잘 지내고 있었네? 엄마가 걱정 괜히 했네~"
    },
    { speaker: "엄마", text: "아휴 벌써 시간이 이렇게! 엄마 간다!" },
    { text: "(저벅저벅저벅...)" },
    { speaker: username, text: "..평소에도 경계심을 늦추면 안 되겠다." },
  ],
});

export default gameScript;
