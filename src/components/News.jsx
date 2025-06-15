import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/News.css';

function NewsComponent({ onClose }) {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    // 1) 먼저 랜덤 3개 뉴스 ID 저장 (필요시)
    const saveRandomNewsIds = async () => {
      try {
        await axios.post('/api/news/random-ids', null, {
          params: { gameProgressId: 1 },
        });
        console.log('랜덤 뉴스 3개 저장 완료');
      } catch (error) {
        console.error('뉴스 저장 실패:', error);
      }
    };

    // 2) 저장된 뉴스 3개 모두 조회
    const fetchSavedNews = async () => {
      try {
        const response = await axios.get('/api/news/saved-news', {
          params: { gameProgressId: 1 },
        });
        setNewsList(response.data);
      } catch (error) {
        console.error('뉴스 불러오기 실패:', error);
      }
    };

    // 저장하고 조회하기
    saveRandomNewsIds().then(fetchSavedNews);

  }, []);

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>뉴스 목록</h2>
        <div className="news-list">
          {newsList.length === 0 ? (
            <p>뉴스가 없습니다.</p>
          ) : (
            newsList.map((newsItem, idx) => (
              <p key={idx}>{newsItem.news /* 또는 newsItem.title 등 실제 필드명으로 변경 */}</p>
            ))
          )}
        </div>
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

export default NewsComponent;
