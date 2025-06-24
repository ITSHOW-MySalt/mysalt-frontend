const heroineScript = (heroine, meetCount, username) => {
  if (heroine === "A") {
    if (meetCount === 0) {
      return [
        {
          text: "기분전환을 위해 카페로 나왔다.",
          choices: [{ text: "다음", nextIndex: 1 }],
        },
        {
          speaker: username,
          text: "음, 오늘은 뭐 먹지...",
          choices: [
            { text: "딸기라떼 (₩5000)", affection: 5, money: -5, nextIndex: 2 },
            { text: "아아 (₩2000)", affection: 2, nextIndex: 3 },
          ],
        },
        {
          speaker: "히로인 A",
          text: "딸기라떼를 좋아하는구나!",
          choices: [{ text: "다음", nextIndex: 4 }],
        },
        {
          speaker: "히로인 A",
          text: "아아를 좋아하는구나!",
          choices: [{ text: "다음", nextIndex: 4 }],
        },
        {
          speaker: username,
          text: "좋은 선택이었어!",
          choices: [], // 선택지 없으면 그냥 다음 대사로 넘어감
        },
      ];
    } else if (meetCount === 1) {
      return [
        { speaker: "히로인 A", text: "어, 선배 오늘도 여기 오셨네요. 우연이네요~" },
        { speaker: "히로인 A", text: "오늘 날씨 좋지 않아요?", choices: [{ text: "다음", nextIndex: 1 }],},
        {
          speaker: "히로인 A",
          text: "뭐 할래요?",
          choices: [
            {
              text: "같이 산책할래?",
              affection: 5,
              image: "heroineA_smile.png",
              result: "좋아요~ 같이 걸어요!",
              nextIndex: 4,
            },
            {
              text: "안좋은데?",
              affection: -2,
              image: "heroineA_sad.png",
              result: "아... 그렇구나...",
              nextIndex: 5,
            },
          ],
        },
        {
          speaker: "히로인 A",
          text: "산책하러 가는 길이 즐거웠어!",
          choices: [{ text: "다음", nextIndex: 6 }],
        },
        {
          speaker: "히로인 A",
          text: "기분이 안 좋아서 좀 걷는게 필요했어.",
          choices: [{ text: "다음", nextIndex: 6 }],
        },
        {
          speaker: "히로인 A",
          text: "다음에 또 같이 놀자!",
          choices: [],
        },
      ];
    }
    // meetCount > 1일 때도 비슷한 패턴으로 추가 가능
    else {
      return [
        {
          speaker: "히로인 A",
          text: "또 만났네요! 요즘 선배 자주 보여서 좋아요.",
          choices: [{ text: "다음", nextIndex: 1 }],
        },
        {
          speaker: "히로인 A",
          text: "뭐 마실래요?",
          choices: [
            {
              text: "카푸치노",
              affection: 3,
              image: "heroineA_happy.png",
              result: "카푸치노 좋아요!",
              nextIndex: 2,
            },
            {
              text: "에스프레소",
              affection: 1,
              image: "heroineA_normal.png",
              result: "에스프레소도 괜찮죠.",
              nextIndex: 3,
            },
          ],
        },
        {
          speaker: "히로인 A",
          text: "카푸치노를 선택했군요! 맛있게 드세요!",
          choices: [],
        },
        {
          speaker: "히로인 A",
          text: "에스프레소를 선택했군요! 깔끔하죠!",
          choices: [],
        },
      ];
    }
  } else if (heroine === "B") {
    if (meetCount === 0) {
      return [
        {
          speaker: "히로인 B",
          text: "안녕하세요! 오늘 처음 뵙네요.",
          choices: [
            {
              text: "초콜릿 케이크 먹을래?",
              affection: 4,
              image: "heroineB_happy.png",
              result: "초콜릿 케이크라니! 좋아요!",
              nextIndex: 1,
            },
            {
              text: "녹차 마실래?",
              affection: 2,
              image: "heroineB_normal.png",
              result: "녹차도 좋은 선택이에요.",
              nextIndex: 2,
            },
          ],
        },
        {
          speaker: "히로인 B",
          text: "초콜릿 케이크를 선택했네요! 달콤하죠?",
          choices: [],
        },
        {
          speaker: "히로인 B",
          text: "녹차를 선택했네요! 깔끔한 맛이에요!",
          choices: [],
        },
      ];
    } else {
      return [
        { speaker: "히로인 B", text: "오늘도 만나서 반가워요!" },
        {
          speaker: "히로인 B",
          text: "뭐 하고 싶어요?",
          choices: [
            {
              text: "영화 볼래?",
              affection: 5,
              image: "heroineB_smile.png",
              result: "좋아요, 영화 좋아해요!",
              nextIndex: 3,
            },
            {
              text: "산책할래?",
              affection: 3,
              image: "heroineB_normal.png",
              result: "산책도 좋죠!",
              nextIndex: 4,
            },
          ],
        },
        {
          speaker: "히로인 B",
          text: "영화를 선택했네요! 재미있게 봐요!",
          choices: [],
        },
        {
          speaker: "히로인 B",
          text: "산책을 선택했네요! 기분 전환되겠네요!",
          choices: [],
        },
      ];
    }
  }

  // 기본값 (만약 heroine이 A,B 둘 다 아니면)
  return [{ text: "대사가 준비되어 있지 않습니다." }];
};

export default heroineScript;
