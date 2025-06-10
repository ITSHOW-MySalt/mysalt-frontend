import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderBar from "../components/HeaderBar"; // 상단 바 컴포넌트 (HeaderBar로 이름 변경)
import BottomStats from "../components/BottomStats"; // 하단 스탯 바 컴포넌트
import News from "../components/News"; // 뉴스 컴포넌트 (뉴스 창 컴포넌트일 가능성 확인 필요)
import "../styles/Game.css";
import "../styles/Game2.css"; // 상단 아이콘 스타일 등
import "../styles/ChoiceButton.css"; // 선택지 버튼 스타일

// 게임 스크립트 예시 데이터 (이건 스토리 진행 로직 만들 때 사용)
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
  // 스탯 상태 (백엔드에서 받아서 설정)
  const [stats, setStats] = useState({
    money: 0,
    health: 0,
    mental: 0,
    reputation: 0,
  });

  // 게임 날짜 상태 추가
  const [gameDay, setGameDay] = useState(0); // D-Day면 0, D+1이면 1 이런 식

  const [showNews, setShowNews] = useState(false);

  // 뉴스 창 열고 닫는 함수
  const toggleNews = () => {
    setShowNews(!showNews);
  };

  // 나중에 선택지에 따라 setStats로 값 변경 가능

  // 컴포넌트 처음 마운트될 때 백엔드에서 초기 게임 데이터 가져오기
  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) {
      axios
        .get("/api/init", { params: { username } })
        .then((res) => {
          const data = res.data;
          setStats({ // 스탯 상태 설정
            money: data.ch_stat_money,
            health: data.ch_stat_health,
            mental: data.ch_stat_mental,
            reputation: data.ch_stat_rep,
          });
          // 백엔드에서 받은 D-Day 값으로 게임 날짜 상태 설정
          // 백엔드 응답 데이터에 game_day 필드가 있다고 가정
          setGameDay(data.game_day);
        })
        .catch((err) => {
          console.error("게임 초기화 데잍 로딩 실패", err);
           // 백엔드 데이터 로딩 실패 시 기본 날짜 설정
           setGameDay(0); // 예시: 실패 시 D-Day로 시작
        });
    } else {
      console.error("username 없음");
      // username 없으면 기본 날짜 설정
      setGameDay(0); // 예시: D-Day로 시작
    }
  }, []); // 빈 의존성 배열: 컴포넌트 처음 마운트될 때만 실행

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
      console.log("스크립트 끝, 다음 단계!");
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

      {/* HeaderBar 컴포넌트 사용 및 props 전달 */}
      <HeaderBar gameDay={gameDay} toggleNews={toggleNews} />


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
        {/* 스크립트 마지막 전까지만 버튼 보이게 조건부 렌더링 */}
        {currentScriptIndex < gameScript.length - 1 && (
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
        {/* 선택지는 아직 안 보이게 하거나, 스크립트 마지막에 보이게 하려면 조건부 렌더링 필요 */}
        <button className="main-button">선택지 1 </button>
        <button className="main-button">선택지 2 </button>
      </div>

      {/* News 상태가 true일 때만 News 보여주기 (뉴스 창 컴포넌트 사용) */}
      {showNews && <News onClose={toggleNews} />}

    </div>
  );
}

export default Game;
