import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/News.css';

function NewsComponent({ onClose, userId }) {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    // 저장된 뉴스 불러오기
    const fetchSavedNews = async () => {
        console.log("NewsComponent userId:", userId);
      try {
        const response = await axios.get('/api/news/saved-news', {
          params: { gameProgressId: userId },
          withCredentials: true,
        });
        setNewsList(response.data);
        console.log("뉴스 응답 데이터:", response.data);
      } catch (error) {
        console.error('뉴스 불러오기 실패:', error);
      }
    };

    fetchSavedNews();
  }, [userId]);

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>뉴스 목록</h2>
        <div className="news-list">
          {newsList.length === 0 ? (
            <p>뉴스가 없습니다.</p>
          ) : (
            newsList.map((newsItem, idx) => (
              <p key={idx}>
                {newsItem.news || newsItem.title || `뉴스 ${idx + 1}`}
              </p>
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
