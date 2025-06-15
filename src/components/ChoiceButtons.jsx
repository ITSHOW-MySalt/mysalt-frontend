import React, { useState } from "react";
import "../styles/ChoiceButtons.css";

function ChoiceButtons({ choices, onChoiceSelected, onNext }) {
  const [disabled, setDisabled] = useState(false);

  const handleChoiceClick = (index) => {
    if (disabled) return;

    setDisabled(true);
    onChoiceSelected(index);

    // 0.3초 후 다시 버튼 활성화
    setTimeout(() => setDisabled(false), 300);
  };

  const handleNextClick = () => {
    if (disabled) return;

    setDisabled(true);
    onNext();

    setTimeout(() => setDisabled(false), 300);
  };

  if (!choices || choices.length === 0) {
    return (
      <div className="choice-buttons-center">
        <button onClick={handleNextClick} disabled={disabled}>다음</button>
      </div>
    );
  }

  if (choices.length === 1) {
    return (
      <div className="choice-buttons-center">
        <button onClick={() => handleChoiceClick(0)} disabled={disabled}>
          {choices[0].text}
        </button>
      </div>
    );
  }

  return (
    <div className="game-choices">
      {choices.map((choice, idx) => (
        <button
          key={idx}
          className="choice-button"
          onClick={() => handleChoiceClick(idx)}
          disabled={disabled}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}

export default ChoiceButtons;
