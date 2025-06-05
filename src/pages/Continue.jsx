import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Base.css';
import '../styles/Continue.css';
import '../styles/Button.css';
import '../styles/Form.css';
import FontStyles from '../components/FontStyles';
import BackButton from '../components/BackButton';

function Continue() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.trim() === '') {
      setError('이름을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/check', {
        username: username.trim()
      });

      if (response.data.available) {
        // 사용 가능한 이름이면 오류로 처리
        setError('존재하지 않는 이름입니다. 다시 확인해주세요.');
      } else {
        // 사용 중인 이름이니 이어하기 가능
        navigate('/Welcome', { state: { username: username.trim(), isReturning: true } });
      }
    } catch (err) {
      console.error('서버 오류:', err);
      setError('서버 통신에 실패했습니다.');
    }
  };

  return (
    <>
      <FontStyles />
      <div className="main-container">
        <img
          className="background-img"
          src={process.env.PUBLIC_URL + '/img/background_gray.png'}
          alt="배경"
        />

        <BackButton />

        <div className="continue-overlay">
          <form onSubmit={handleSubmit} className="name-box">
            <div className="continue-question">
              <p className="question-text">당신의 이름은 무엇이었나요?</p>
            </div>
            <input
              className={`name-box-input ${error ? 'input-error' : ''}`}
              type="text"
              placeholder="이름을 입력하세요"
              value={username}
              onChange={handleInputChange}
              maxLength="20"
              required
            />
            <div className="continue-hint">
              <p className="hint">20자 이내</p>
            </div>
            <button className="next-button" type="submit">다음으로</button>
            {error && <div className="error-text"><p>{error}</p></div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Continue;
