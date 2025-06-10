import React, { useEffect, useState } from "react";

const iconMap = {
  love: "/img/love_icon.png",
};

function Love({ value, max = 100 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value > max ? max : value;
    const duration = 500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      if (
        (increment > 0 && start >= end) ||
        (increment < 0 && start <= end) ||
        currentStep >= steps
      ) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, max]);

  const percentage = (displayValue / max) * 100;

  return (
    <div className="stat-gauge">
      <img src={iconMap.love} alt="Love icon" className="stat-icon" />
      <div className="gauge-bar">
        <div className="gauge-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      {/* <span className="gauge-value">{Math.round(displayValue)}</span> */}
    </div>
  );
}

export default Love;
