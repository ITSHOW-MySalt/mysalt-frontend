import React from 'react';
import '../styles/News.css';

// props로 onClose 함수를 받도록 수정
function News({ onClose }) {
  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>뉴스</h2>
        <div className="news-list">
          <p>서울 낮 최고 온도 40도... 야외활동 자제</p>
          <p>수박 한 통 2만 5천원...여름 수박도 금과일</p>
          <p>무더위 속 냉방병 환자 증가…‘건강과 에어컨 사이’ 고민</p>
          {/* 더 많은 뉴스 항목 추가 */}
        </div>

        {/* 닫기 버튼 */}
        <button className="news-close-button" onClick={onClose}>
        <img
            src={process.env.PUBLIC_URL + "/img/closebtn.png"}
            alt="닫기"
            className="close-icon"
          />
        </button>
      </div>
    </div>
  );
}

export default News;
