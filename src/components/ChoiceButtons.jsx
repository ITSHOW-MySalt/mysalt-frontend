import React from "react";
import "../styles/ChoiceButtons.css";

function ChoiceButtons({ choices, onChoiceSelected, onNext }) {
  if (!choices || choices.length === 0) {
    // 선택지 없을 때 중앙 '다음' 버튼
    return (
      <div className="choice-buttons-center">
        <button onClick={onNext}>다음</button>
      </div>
    );
  }

  if (choices.length === 1) {
    // 선택지 1개일 때도 버튼 하나만 중앙에 (선택지 텍스트 사용)
    return (
      <div className="choice-buttons-center">
        <button onClick={() => onChoiceSelected(0)}>{choices[0].text}</button>
      </div>
    );
  }

  // 선택지 2개 이상일 때 기존 다중 버튼 노출
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
