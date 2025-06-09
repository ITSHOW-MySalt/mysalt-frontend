import React, { useEffect, useState } from "react";
import axios from "axios";
import Bar from "../components/Bar"; // 상단 바 컴포넌트
import BottomStats from "../components/BottomStats"; // 하단 스탯 바 컴포넌트
import News from "../components/News"; // 뉴스 컴포넌트
import "../styles/Game.css";
import "../styles/Game2.css";
import "../styles/ChoiceButton.css";

// 게임 스크립트 예시 데이터
const gameScript = [
  "내이름은 id. 평범한 대학생이다.",
  "그리고 오늘, 처음으로 자취를 시작하게 되었다.",
  "방학 동안 편하게 쉬려고 했는데...",
  "부모님께선 나를 독립시켜버리셨다.",
  "이제부터 월세, 생활비... 모든걸 스스로 해결해야한다.",
  "집 안을 둘러보니, 아직은 낯설기만 한 자취방.",
  "뭐, 그래도 어떻게든 되겠지?",
  "목표는 간단하다. 개강까지 살아남기.",
  "그럼, 시작해볼까?",
];

function Game() {
  // 스탯 상태(임시)
  const [stats, setStats] = useState({
    money: 0,
    health: 0,
    mental: 0,
    reputation: 0,
  });

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) {
      axios
        .get("/api/init", { params: { username } })
        .then((res) => {
          const data = res.data;
          setStats({
            money: data.ch_stat_money,
            health: data.ch_stat_health,
            mental: data.ch_stat_mental,
            reputation: data.ch_stat_rep,
          });
        })
        .catch((err) => {
          console.error("게임 초기화 데잍 로딩 실패", err);
        });
    } else {
      console.error("username 없음");
    }
  }, []);

  const [showNews, setShowNews] = useState(false);

  // 뉴스 창 열고 닫는 함수
  const toggleNews = () => {
    setShowNews(!showNews);
  };

  // 나중에 선택지에 따라 setStats로 값 변경 가능

  // 현재 보여줄 스크립트의 순서와 내용 관리 state
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0); // 현재 스크립트 배열 인덱스 (0부터 시작)
  // 현재 인덱스에 해당하는 스크립트 텍스트 가져오기
  const currentStoryText = gameScript[currentScriptIndex];

  // 다음 스크립트로 넘어가는 함수
  const goToNextScript = () => {
    // 스크립트 배열의 마지막 문장이 아니면 다음 인덱스로 이동
    if (currentScriptIndex < gameScript.length - 1) {
      setCurrentScriptIndex(currentScriptIndex + 1);
    } else {
      // 스크립트의 마지막 문장이면 다음 단계 (선택지 표시 등) 로직 처리
      console.log(" "); // 콘솔에 메시지 출력 (테스트용)
      // 여기에 선택지를 보여주는 state를 true로 바꾸거나 하는 로직 추가
    }
  };

  return (
    <div className="main-container">
      <img
        className="background-img"
        src={process.env.PUBLIC_URL + "/img/background_gray.png"}
        alt="게임 배경 이미지"
      />
      <img
        className="background-home"
        src={process.env.PUBLIC_URL + "/img/background_home.png"}
        alt="집 배경"
      />

      <Bar toggleNews={toggleNews} />

      {/* 게임 메인 콘텐츠 영역 */}
      <div className="game-overlay">
        {/* 게임 스토리가 표시될 텍스트 */}
        <div className="game-story-text">
          {/* 현재 스크립트 텍스트 state 값 연결 */}
          <p>{currentStoryText}</p>
        </div>

        {/* 캐릭터 이미지 추가 */}
        {/* <img src="/img/character.png" alt="캐릭터"/> */}

        {/* 임시 '다음 텍스트' 버튼 (스크립트 진행 테스트용) */}
        {/* 스크립트 마지막이 아닐 때만 버튼 보이게 조건부 렌더링 */}
        {currentScriptIndex < gameScript.length - 1 && ( // 마지막 전까지만 버튼 보이게
          <button
            onClick={goToNextScript} // 버튼 클릭 시 다음 스크립트 함수 실행
            // 임시 스타일 (필요시 CSS 파일로 옮기거나 클래스 사용)
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px", // 오른쪽 하단에 배치
              zIndex: 10,
              padding: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ▶
          </button>
        )}
      </div>

      <BottomStats stats={stats} />

      {/* 게임 선택지 영역 */}
      <div className="game-choices">
        {/* Button.css에 있는 main-button 스타일 사용 */}
        <button className="main-button">선택지 1 </button>
        <button className="main-button">선택지 2 </button>
      </div>

      {/* News 상태가 true일 때만 News 보여주기 */}
      {showNews && <News onClose={toggleNews} />}
    </div>
  );
}

export default Game;
