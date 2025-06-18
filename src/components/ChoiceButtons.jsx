import React from "react";
import "../styles/ChoiceButtons.css";

function ChoiceButtons({ choices, onChoiceSelected, onNext }) {
  if (!choices || choices.length === 0) {
    // 선택지가 없을 때 '다음' 버튼 중앙에 표시
    return (
      <div className="choice-buttons-center">
        <button onClick={onNext}>다음</button>
      </div>
    );
  }

  if (choices.length === 1) {
    // 선택지 1개일 경우 버튼 하나 중앙에
    return (
      <div className="choice-buttons-center">
        <button onClick={() => onChoiceSelected(0)}>
          {choices[0].text}
        </button>
      </div>
    );
  }

  // 선택지 2개 이상일 경우 좌우 배치
  return (
    <div className="game-choices">
      {choices.map((choice, idx) => (
        <button
          key={idx}
          className="choice-button"
          onClick={() => onChoiceSelected(idx)}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}

export default ChoiceButtons;
