import React from "react";
import "../styles/ChoiceButtons.css";

function ChoiceButtons({ choices, onChoiceSelected, onNext, disabled }) {
  // onNext가 없으면 버튼 안 보임
  if ((!choices || choices.length === 0) && onNext) {
    return (
      <div className="choice-buttons-center">
        <button onClick={onNext} disabled={disabled}>
          다음
        </button>
      </div>
    );
  }

  if (choices && choices.length === 1) {
    return (
      <div className="choice-buttons-center">
        <button onClick={() => onChoiceSelected(0)} disabled={disabled}>
          {choices[0].text}
        </button>
      </div>
    );
  }

  if (choices && choices.length >= 2) {
    return (
      <div className="game-choices">
        {choices.map((choice, idx) => (
          <button
            key={idx}
            className="choice-button"
            onClick={() => onChoiceSelected(idx)}
            disabled={disabled}
          >
            {choice.text}
          </button>
        ))}
      </div>
    );
  }

  return null; // 아무것도 없으면 렌더링 안 함
}

export default ChoiceButtons;
