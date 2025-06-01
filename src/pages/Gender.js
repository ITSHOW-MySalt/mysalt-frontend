import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Base.css";
import "../styles/Gender.css";
import "../components/Button.css";
import "../components/Form.css";
import FontStyles from "../components/FontStyles";

function Gender() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;

  const handleGenderSelect = async (gender) => {
    console.log("전송할 데이터:", {
      username,
      gender,
    });

    try {
      const response = await axios.post(
        "http://localhost:8089/api/user",
        {
          username,
          gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("서버 응답:", response.data);

      // 다음 페이지로 이동
      navigate("/welcome");
    } catch (error) {
      console.error("서버 전송 실패:", error);
      alert("서버 전송에 실패했습니다.");
    }
  };

  return (
    <>
      <FontStyles />
      <div className="main-container">
        <img
          className="background-img"
          src={process.env.PUBLIC_URL + "/img/background_gray.png"}
          alt="배경"
        />

        <button className="back-button" onClick={() => navigate(-1)}>
          <img
            className="back-button-img"
            src={process.env.PUBLIC_URL + "/img/back_arrow.png"}
            alt="뒤로가기"
          />
        </button>

        <div className="gender-overlay">
          <p className="question-text">당신의 성별은 무엇인가요?</p>
          <div className="gender-hint">
            <p className="hint">(스토리에 영향을 끼치지 않습니다.)</p>
          </div>

          <div className="gender-button">
            <button
              type="button"
              className="main-button"
              onClick={() => handleGenderSelect(1)}
            >
              여자
            </button>
            <button
              type="button"
              className="main-button"
              onClick={() => handleGenderSelect(0)}
            >
              남자
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gender;
