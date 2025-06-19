import React from "react";
import "../styles/ChoiceButtons.css";

function ChoiceButtons({ choices, onChoiceSelected, onNext }) {
  // ✅ onNext가 없을 경우 버튼 자체를 안 보여줌
  if ((!choices || choices.length === 0) && onNext) {
    return (
      <div className="choice-buttons-center">
        <button onClick={onNext}>다음</button>
      </div>
    );
  }

  if (choices && choices.length === 1) {
    return (
      <div className="choice-buttons-center">
        <button onClick={() => onChoiceSelected(0)}>
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
          >
            {choice.text}
          </button>
        ))}
      </div>
    );
  }

  return null; // ✅ 아무것도 없을 경우 아무것도 렌더링하지 않음
}

export default ChoiceButtons;
