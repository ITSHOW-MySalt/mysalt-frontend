import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Continue.css';

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

    console.log('입력한 이름:', name);

    // 이름 입력칸이 비어있는지 체크
    if (name.trim() === '') {
      setError('이름을 입력해주세요.'); // 비어있으면 에러 메시지 표시
      return;
    }

    alert(`이름 확인 완료: ${name}`);
    navigate('/ContinueStart'); 



    // TODO: 이름 유효성 검사나 API 호출 로직 구현
    /*
    try {
      const response = await fetch('/continueCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || '오류 발생');
        // setNameError(errorData.nameError);
        return;
      }

      const result = await response.json();
      console.log('검증 성공:', result);
      alert('이름 확인 완료');
      navigate('/next');
    } catch (err) {
      console.error('서버 통신 에러:', err);
      setError('서버와 통신 중 오류가 발생했습니다.');
    }
    */
  };

  return (
    <>
      <div className="continue-container">
        <img
          className="bg"
          src={process.env.PUBLIC_URL + '/img/background_gray.png'}
          alt="배경"
        />
        {/* 뒤로가기 버튼은 Username.js와 동일한 구조와 이미지 사용 */}
        <button className="back-button" onClick={() => navigate('/')}> {/* 클릭 시 Main으로 이동 */}
          <img
            src={process.env.PUBLIC_URL + '/img/back_arrow.png'}
            alt="뒤로가기"
          />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="name-box">
          <p>당신의 이름은 무엇이었나요?</p>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            name="name"
            required
            value={name}
            onChange={handleInputChange}
            className={error ? 'input-error' : ''} 
            maxLength="20"
          />
          <p className="hint">20자 이내</p>
        </div>


        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
            <p>{error}</p>
          </div>
        )}

        <div className="next-btn">
          <button className="custom-button" type="submit">
            다음으로
          </button>
        </div>
      </form>
    </>
  );
}

export default Continue;