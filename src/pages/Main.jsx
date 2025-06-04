import { useNavigate } from "react-router-dom";
import '../styles/Base.css';
import '../styles/Main.css';
import '../styles/Button.css';
import FontStyles from '../components/FontStyles';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <>
      <FontStyles />
      <div className="main-container">
        <img src="/img/start_back.png" alt="배경" className="background-img" />

        <div className="main-overlay">
          <button className="main-button" onClick={() => navigate("/Username")}>
            새로시작
          </button>
          <button className="main-button" onClick={() => navigate("/Continue")}>
            이어하기
          </button>
        </div>
      </div>
    </>
  );
}
