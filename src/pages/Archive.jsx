import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Archive.css";

function Archive() {
  const [activeTab, setActiveTab] = useState("ending");
  const navigate = useNavigate();

  return (
    <div className="Archive-container">
      <header className="Archive-header">
        <button className="back-button-1" onClick={() => navigate(-1)}>
          <img src="/img/back_arrow2.png" alt="뒤로가기" />
        </button>

        <div className="tabs">
          <button
            className={activeTab === "ending" ? "active" : ""}
            onClick={() => setActiveTab("ending")}
          >
            엔딩
          </button>
          <button
            className={activeTab === "illustration" ? "active" : ""}
            onClick={() => setActiveTab("illustration")}
          >
            삽화
          </button>
        </div>
      </header>

      <main className="Archive-content">
        {activeTab === "ending" && (
          <div className="card-grid">
            <div className="card unlocked">
              <div className="card-label">ed. 01</div>
              <div className="card-title">거지가 되어</div>
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
          </div>
        )}

        {activeTab === "illustration" && (
          <div className="card-grid">
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
            <div className="card locked">
              <img src="/img/lock_icon.png" alt="잠금" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Archive;
