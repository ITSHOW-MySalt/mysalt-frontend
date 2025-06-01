import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 추가
import '../styles/Base.css';
import '../styles/Continue.css';
import '../components/Button.css';
import '../components/Form.css';
import FontStyles from '../components/FontStyles';

function Continue() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setName(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      setError('이름을 입력해주세요.');
      return;
    }

    try {
      // Axios로 서버에 POST 요청
      const response = await axios.post('/api/continue', {
        name: name.trim()
      });

      console.log('서버 응답:', response.data);

      // 서버에서 응답이 "success"이면 다음 페이지로 이동
      if (response.data === 'success') {
        navigate('/ContinueStart', { state: { name } });
      } else {
        setError('이름이 존재하지 않거나 오류가 발생했습니다.');
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
        <img className="background-img" src={process.env.PUBLIC_URL + '/img/background_gray.png'} alt="배경" />

        <button className="back-button" onClick={() => navigate('/')}>
          <img className="back-button-img" src={process.env.PUBLIC_URL + '/img/back_arrow.png'} alt="뒤로가기" />
        </button>

        <div className="continue-overlay">
          <form onSubmit={handleSubmit} className="name-box">
            <div className="continue-question">
              <p className="question-text">당신의 이름은 무엇이었나요?</p>
            </div>
            <input
              className={`name-box-input ${error ? 'input-error' : ''}`}
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
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
