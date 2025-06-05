import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css';

const BackButton = ({ to = '/' }) => {
  const navigate = useNavigate();

  return (
    <div className="back-button-container">
      <button className="back-button" onClick={() => navigate(to)}>
        <img
          className="back-button-img"
          src={process.env.PUBLIC_URL + '/img/back_arrow.png'}
          alt="뒤로가기"
        />
      </button>
    </div>
  );
};

export default BackButton;
