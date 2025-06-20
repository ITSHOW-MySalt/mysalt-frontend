// src/data/heroineScript.js

const heroineScript = (heroine, meetCount) => {
  if (heroine === "A") {
    if (meetCount === 0) {
      return [
        {
          text: "음, 오늘은 뭐 먹지...",
          choices: [
            {
              text: "딸기라떼 (₩5000)",
              affection: 5,
              image: "heroineA_happy.png",
              money: -5000,
              result: "오~ 딸기라떼 좋아해요!",
            },
            {
              text: "아아 (₩2000)",
              affection: 2,
              image: "heroineA_normal.png",
              result: "아아... 무난하죠.",
            },
          ],
        },
      ];
    } else if (meetCount === 1) {
      return [
        { text: "어, 선배 오늘도 여기 오셨네요. 우연이네요~" },
        { text: "오늘 날씨 좋지 않아요?" },
        {
          text: "뭐 할래요?",
          choices: [
            {
              text: "같이 산책할래?",
              affection: 5,
              image: "heroineA_smile.png",
              result: "좋아요~ 같이 걸어요!",
            },
            {
              text: "안좋은데?",
              affection: -2,
              image: "heroineA_sad.png",
              result: "아... 그렇구나...",
            },
          ],
        },
      ];
    } else {
      return [
        { text: "또 만났네요! 요즘 선배 자주 보여서 좋아요." },
        {
          text: "뭐 마실래요?",
          choices: [
            {
              text: "카푸치노",
              affection: 3,
              image: "heroineA_happy.png",
              result: "카푸치노 좋아요!",
            },
            {
              text: "에스프레소",
              affection: 1,
              image: "heroineA_normal.png",
              result: "에스프레소도 괜찮죠.",
            },
          ],
        },
      ];
    }
  } else if (heroine === "B") {
    if (meetCount === 0) {
      return [
        {
          text: "안녕하세요! 오늘 처음 뵙네요.",
          choices: [
            {
              text: "초콜릿 케이크 먹을래?",
              affection: 4,
              image: "heroineB_happy.png",
              result: "초콜릿 케이크라니! 좋아요!",
            },
            {
              text: "녹차 마실래?",
              affection: 2,
              image: "heroineB_normal.png",
              result: "녹차도 좋은 선택이에요.",
            },
          ],
        },
      ];
    } else {
      return [
        { text: "오늘도 만나서 반가워요!" },
        {
          text: "뭐 하고 싶어요?",
          choices: [
            {
              text: "영화 볼래?",
              affection: 5,
              image: "heroineB_smile.png",
              result: "좋아요, 영화 좋아해요!",
            },
            {
              text: "산책할래?",
              affection: 3,
              image: "heroineB_normal.png",
              result: "산책도 좋죠!",
            },
          ],
        },
      ];
    }
  }

  // 기본값 (만약 heroine이 A,B 둘 다 아니면)
  return [{ text: "대사가 준비되어 있지 않습니다." }];
};

export default heroineScript;
