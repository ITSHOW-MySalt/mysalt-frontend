import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src={process.env.PUBLIC_URL + "/img/start.png"} alt="시작화면" />
      <div className="overlay">
        <button
          className="custom-button"
          onClick={() => navigate("/Username")}>새로시작</button>
        <button className="custom-button">이어하기</button>
      </div>
    </div>
  );
}

export default Main;
