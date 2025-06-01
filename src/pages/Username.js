import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Base.css';
import '../styles/Username.css';
import '../components/Button.css';
import '../components/Form.css';
import FontStyles from '../components/FontStyles';

function Username() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setUsername(event.target.value);
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username.trim() === '') {
      setError('닉네임을 입력해주세요.');
      return;
    }

    navigate('/gender', { state: { username } });
  };

  return (
    <>
      <FontStyles />
      <div className="main-container">
        <img className="background-img" src={process.env.PUBLIC_URL + "/img/background_gray.png"} alt="배경" />

        <button className="back-button" onClick={() => navigate(-1)}>
          <img className="back-button-img" src={process.env.PUBLIC_URL + "/img/back_arrow.png"} alt="뒤로가기" />
        </button>

        <div className="username-overlay">
          <form onSubmit={handleSubmit} className="name-box">
          <div className="username-question">
            <p className="question-text">잠깐, 당신의 이름은 무엇인가요?</p>
            </div>
            <input
              className={`name-box-input ${error ? 'input-error' : ''}`}
              type="text"
              placeholder="닉네임을 입력하세요"
              value={username}
              onChange={handleInputChange}
              maxLength="20"
              required
            />
            <div className="username-hint">
            <p className="hint">중복 불가, 20자 이내</p>
            </div>
            {error && <div className="error-text"><p>{error}</p></div>}
            <button className="next-button" type="submit">다음으로</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Username;
