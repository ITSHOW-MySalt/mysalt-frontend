import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Username.css';

function Username() {
  // 상태 관리: 사용자 입력값, 에러 메시지
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  // React Router 훅
  const navigate = useNavigate();

  // 입력값 변경 핸들러
  const handleInputChange = (event) => {
    setUsername(event.target.value);
    setError(null);
    setUsernameError(null);
  };

  // 폼 제출 핸들러 (비동기 통신 -- fetch 부분 주석처리함)
  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 제출 방지

    console.log('사용자 이름 제출:', username);

    // TODO: 'Loginresult' 경로로 사용자 이름 전송 API 호출 로직 구현
    // 여기서부터 fetch 관련 코드 주석 시작 
    /*
    try {
      const response = await fetch('/loginSuccess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || '로그인 실패');
        setUsernameError(errorData.usernameError);
        return;
      }

      const result = await response.json();
      console.log('제출 성공:', result);
      alert('로그인 성공');

      navigate('/gender'); // 이 코드는 fetch 성공 시가 아니라 바로 실행되게 옮겨야 함

    } catch (err) {
      console.error('API 호출 중 에러 발생:', err);
      setError('서버 통신 중 오류가 발생했습니다.');
    }
    */
    // fetch 관련 코드 주석 끝


    // fetch 성공 여부와 상관없이 '다음으로' 버튼 누르면 바로 다음 페이지로 이동
    // TODO: Loginresult 경로로 사용자 이름 전송 API 호출 로직 구현 (나중에 이 코드 살리면 됨)
    alert(`사용자 이름: ${username} 입력됨`); 
    navigate('/gender'); // '/gender' 페이지로 이동


  };

  return (
    <>
      <div className="username-container">
        <img className="bg" src={process.env.PUBLIC_URL + "/img/background_gray.png"} alt="첫 시작" />
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={process.env.PUBLIC_URL + "/img/back_arrow.png"} alt="뒤로가기" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="username-box">
          <p>잠깐, 당신의 이름은 무엇인가요?</p>
          {/* 입력 필드 */}
          <input type="text"
                 placeholder="닉네임을 입력하세요"
                 name="username"
                 required
                 value={username}
                 onChange={handleInputChange}
                 className={usernameError || error ? 'input-error' : ''}
                 maxLength="20" // 20자 제한 (HTML 속성)
                 />
          <p className="hint">중복 불가, 20자 이내</p>
        </div>

        {/* 에러 메시지 표시 */}
        {usernameError && ( 
          <div style={{ color: 'red' }}>
            <p>{usernameError}</p>
          </div>
        )}
        {error && !usernameError && (
           <div style={{ color: 'red' }}>
             <p>{error}</p>
           </div>
        )}

        <div className="start-btn">
        {/* 이 버튼은 type="submit"으로 handleSubmit 함수를 실행하게 됨 */}
        <button className="custom-button" type="submit">
          다음으로
        </button>
        </div>
      </form>
    </>
  );
}

export default Username;
